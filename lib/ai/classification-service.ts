import { pipeline, env } from '@huggingface/transformers';
import { addNotification } from '../firebase/notifications';

// Configure Transformers.js for remote model fetching
env.allowLocalModels = false;
env.allowRemoteModels = true;

// Ensure we use the browser's standard cache.
// In some environments, disabling this can lead to "Unauthorized" (401) errors.
env.useBrowserCache = true;

// Explicitly set the remote configuration to ensure reliable fetches from Hugging Face Hub.
env.remoteHost = 'https://huggingface.co';
env.remotePathTemplate = '{model}/resolve/{revision}/';

export interface ClassificationResult {
  className: string;
  probability: number;
}

// Expanded waste category definitions with rich educational disposal tips
export interface WasteClassificationResult {
  detectedItem: string;   // specific label e.g. "water bottle"
  wasteCategory: string;  // display label e.g. "Plastic"
  formValue: string;      // matches form options: organic | plastic | metal | general | mixed
  probability: number;
  disposalTips: string;
  didYouKnow: string;
}

const WASTE_CATEGORIES: {
  keywords: string[];
  formValue: string;
  category: string;
  disposalTips: (item: string) => string;
  didYouKnow: string;
}[] = [
  {
    formValue: 'organic',
    category: 'Organic',
    keywords: ['banana', 'apple', 'orange', 'lemon', 'pear', 'pineapple', 'strawberry', 'fig',
      'broccoli', 'carrot', 'corn', 'mushroom', 'cauliflower', 'cucumber', 'artichoke',
      'pizza', 'burger', 'sandwich', 'hotdog', 'meat', 'fish', 'egg', 'bread', 'rice',
      'cake', 'cookie', 'waffle', 'pretzel', 'cheese', 'fruit', 'vegetable', 'food',
      'compost', 'scrap', 'peel', 'shell', 'ground', 'husks', 'rinds', 'stems', 'seeds',
      'meal', 'dish', 'plate', 'leftover'],
    disposalTips: (item) =>
      `Your ${item} is organic waste — the most compostable type of waste there is. Place it in a compost bin or your council's green organics bin. Home composting works best: mix food scraps with dry material like cardboard or garden clippings in a 1:3 ratio to keep the pile balanced and odour-free. Avoid composting meat, dairy, or oily food at home as they attract pests — use a sealed bokashi system instead. Compost juice or liquid by diluting with water before adding to the heap. If you generate large volumes, a worm farm turns food scraps into excellent garden fertiliser within weeks.`,
    didYouKnow: `Food waste in landfills produces methane, a greenhouse gas 25× more potent than CO₂. In Kenya, food waste accounts for over 50% of organic waste — yet most households still don't compost.`,
  },
  {
    formValue: 'organic',
    category: 'Organic',
    keywords: ['leaf', 'plant', 'flower', 'grass', 'tree', 'shrub', 'bush', 'wood', 'log',
      'branch', 'hay', 'straw', 'palm', 'fern', 'succulent', 'cactus', 'soil'],
    disposalTips: (item) =>
      `Your ${item} is garden or yard waste — fully compostable and valuable for soil health. Leaves, grass clippings, and small branches can go straight into a compost heap or green bin. Chop or shred large branches first to speed up decomposition. Avoid composting diseased plants — bag them and put in general waste to stop the spread. Grass clippings can be left on the lawn as natural mulch ("grasscycling"), returning nutrients directly to the soil and reducing the need for fertiliser.`,
    didYouKnow: `A single mature tree absorbs up to 22kg of CO₂ per year. Composting yard waste instead of burning or landfilling it returns all those captured nutrients back to the soil.`,
  },
  {
    formValue: 'plastic',
    category: 'Plastic',
    keywords: ['water bottle', 'pop bottle', 'plastic bottle', 'plastic bag', 'plastic container',
      'bottle', 'bucket', 'barrel', 'jug', 'canteen', 'straw', 'plastic', 'wrapper',
      'packaging', 'cup', 'jerry'],
    disposalTips: (item) =>
      `Your ${item} is plastic waste. Check the recycling number stamped on the bottom — types 1 (PET, e.g. water bottles) and 2 (HDPE, e.g. milk jugs) are the most widely accepted for recycling. Always rinse out any food or liquid residue before placing in the recycling bin, as contamination is the top reason recycling gets rejected. Remove caps and lids since they are often a different plastic type. Soft plastic films and bags are generally NOT accepted kerbside — take them to supermarket drop-off points. Replace single-use plastics like straws and cutlery with reusable alternatives where possible.`,
    didYouKnow: `A single plastic bottle takes up to 450 years to decompose in a landfill. Only 9% of all plastic ever produced has been recycled — the rest ends up in landfills, oceans, or is incinerated.`,
  },
  {
    formValue: 'mixed',
    category: 'Mixed / Recyclable',
    keywords: ['cardboard', 'paper', 'newspaper', 'magazine', 'book', 'envelope', 'box',
      'carton', 'tissue', 'paper bag', 'notebook'],
    disposalTips: (item) =>
      `Your ${item} is paper or cardboard — one of the most recyclable materials available. Flatten cardboard boxes before placing in your recycling bin to save space. Keep paper dry — wet or food-stained paper (like greasy pizza boxes) cannot be recycled and should go into compost or general waste. Remove plastic windows from envelopes before recycling. Shredded paper should be sealed in a paper bag to prevent it blowing away. Glossy magazines and catalogues are recyclable. Wax-coated cartons require special processing — check with your local council.`,
    didYouKnow: `Recycling one tonne of paper saves 17 trees, 7,000 litres of water, and enough energy to power a home for 6 months. Paper fibres can be recycled up to 7 times.`,
  },
  {
    formValue: 'mixed',
    category: 'Mixed / Recyclable',
    keywords: ['glass bottle', 'wine bottle', 'beer bottle', 'glass jar', 'jar', 'wine glass',
      'beer glass', 'goblet', 'vase'],
    disposalTips: (item) =>
      `Your ${item} is glass — 100% recyclable and can be recycled endlessly without any loss in quality. Rinse it before placing in your recycling bin and remove metal lids (recycle them separately). Separate glass by colour if your local facility requires it (clear, green, brown). Do NOT place broken glass, mirrors, window glass, drinking glasses, or ceramics in the recycling bin — they have different melting points and contaminate the batch. Wrap broken glass in newspaper and place in general waste for safety.`,
    didYouKnow: `Making new glass from recycled glass uses 40% less energy than making it from raw materials. A glass jar could be back on the shelf as a new product within just 30 days of being recycled.`,
  },
  {
    formValue: 'metal',
    category: 'Metal',
    keywords: ['can', 'tin can', 'tin', 'metal', 'iron', 'steel', 'alumin', 'foil',
      'screw', 'nail', 'wrench', 'hammer', 'bolt', 'pipe', 'wire', 'copper',
      'pot', 'pan', 'spoon', 'fork', 'knife', 'scissors'],
    disposalTips: (item) =>
      `Your ${item} is metal — one of the most valuable and infinitely recyclable materials on earth. Rinse food cans before placing in your recycling bin. Aluminium cans (soft drinks, beer) and steel cans (food tins) are both widely accepted kerbside. Scrunch aluminium foil into a tight ball before recycling — loose pieces jam sorting machinery. For larger scrap metal (appliances, pipes, wire), take it to a metal recycler or scrap yard — many will pay you for it. Aerosol cans are recyclable once completely empty; never puncture or crush them.`,
    didYouKnow: `Recycling aluminium uses 95% less energy than smelting it from raw bauxite ore. In Kenya, the informal recycling sector recovers the vast majority of scrap metal — making it one of the most efficiently recycled materials in the country.`,
  },
  {
    formValue: 'general',
    category: 'General',
    keywords: ['battery', 'remote control', 'keyboard', 'mouse', 'monitor', 'laptop', 'computer',
      'mobile phone', 'cell phone', 'tablet', 'television', 'tv', 'cable', 'circuit',
      'hard disk', 'printer', 'camera', 'radio', 'speaker', 'calculator', 'charger'],
    disposalTips: (item) =>
      `Your ${item} is electronic waste (e-waste) and must NEVER go in a regular bin. E-waste contains valuable materials like gold, copper, and lithium — but also toxic substances like lead, mercury, and cadmium that leach into soil and water. Take it to a certified e-waste drop-off centre or a retailer take-back programme. Many electronics retailers offer free recycling of old devices. Wipe any personal data from phones and laptops before disposal. Batteries should go to dedicated collection points found in most supermarkets and hardware stores.`,
    didYouKnow: `One million recycled mobile phones can yield 24kg of gold, 250kg of silver, and 9,000kg of copper. Yet less than 20% of e-waste worldwide is formally recycled.`,
  },
  {
    formValue: 'general',
    category: 'General',
    keywords: ['syringe', 'medicine', 'pill', 'paint', 'chemical', 'motor oil', 'engine',
      'fuel', 'lighter', 'acid', 'bleach', 'pesticide', 'solvent', 'fire extinguisher'],
    disposalTips: (item) =>
      `Your ${item} is hazardous waste and must NEVER be placed in regular bins or poured down drains. Hazardous waste includes household chemicals, paints, solvents, pesticides, medical sharps, and motor oil. Take it to your local council-run hazardous waste facility or a scheduled community collection event. Always keep hazardous materials in their original containers with lids tightly closed, and never mix chemicals together. Medical sharps must be placed in a puncture-proof sharps container before disposal — many pharmacies accept these. Return unused medicines to a pharmacy for safe disposal.`,
    didYouKnow: `Pouring just one litre of motor oil down a drain can contaminate up to 1 million litres of groundwater — enough to supply one person for 20 years.`,
  },
  {
    formValue: 'general',
    category: 'General',
    keywords: ['shirt', 'suit', 'tie', 'sock', 'shoe', 'sneaker', 'sandal', 'boot', 'hat',
      'coat', 'jacket', 'skirt', 'jeans', 'dress', 'fabric', 'cloth', 'backpack',
      'handbag', 'wallet', 'umbrella'],
    disposalTips: (item) =>
      `Your ${item} is textile or clothing waste — the bin should be the absolute last resort. If it's in good condition, donate it to a charity shop, clothing bank, or someone in need. Worn or torn items can be repurposed as cleaning rags or craft material. Many clothing retailers have in-store textile recycling schemes. When recycling isn't possible, seal it in a bag before placing in general waste — loose textiles tangle in recycling machinery. Natural fibre textiles (cotton, wool, linen) can be composted if they haven't been treated with synthetic dyes.`,
    didYouKnow: `The fashion industry produces 10% of global carbon emissions. Extending the life of a garment by just 9 months reduces its carbon, water, and waste footprint by 20–30%.`,
  },
];

const mapMobileNetToWasteCategory = (
  predictions: { className: string; probability: number }[]
): WasteClassificationResult => {
  for (const pred of predictions) {
    const lower = pred.className.toLowerCase();
    for (const cat of WASTE_CATEGORIES) {
      if (cat.keywords.some((kw) => {
        const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
        return regex.test(lower);
      })) {
        const item = pred.className.split(',')[0].trim().toLowerCase();
        return {
          detectedItem: pred.className.split(',')[0].trim(),
          wasteCategory: cat.category,
          formValue: cat.formValue,
          probability: pred.probability,
          disposalTips: cat.disposalTips(item),
          didYouKnow: cat.didYouKnow,
        };
      }
    }
  }
  // Default: general waste
  const top = predictions[0];
  const item = top?.className.split(',')[0].trim().toLowerCase() ?? 'this item';
  return {
    detectedItem: top?.className.split(',')[0].trim() ?? 'Unknown item',
    wasteCategory: 'General',
    formValue: 'general',
    probability: top?.probability ?? 0.5,
    disposalTips: `Your ${item} appears to be general waste that cannot be easily recycled or composted in standard streams. Place it in your general waste bin. Before binning, consider: can it be repaired, repurposed, or donated? General waste goes to landfill where it produces greenhouse gases as it slowly breaks down. Compacting waste and reducing single-use items at the source is the most impactful change you can make.`,
    didYouKnow: `The average person generates over 1kg of waste per day. Reducing, reusing, and recycling just 30% of your household waste can significantly cut your household carbon footprint.`,
  };
};

// Use any as we don't have perfect types for Transformers.js pipeline return value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let imageClassificationPipeline: any = null;

// Helper to load the model
export const loadClassificationModel = async (progressCallback?: (info: unknown) => void) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (imageClassificationPipeline) {
    return;
  }
  try {
    imageClassificationPipeline = await pipeline('image-classification', 'onnx-community/mobilenet_v2_1.0_224', {
      progress_callback: progressCallback,
    });
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load classification model.');
  }
};

/**
 * Loads the model and classifies an image, mapping to a detailed waste category.
 */
export const classifyImageElement = async (imgEl: HTMLImageElement | string | Blob): Promise<WasteClassificationResult> => {
  if (!imageClassificationPipeline) {
    await loadClassificationModel();
  }

  let imageUrl: string;
  if (imgEl instanceof HTMLImageElement) {
    imageUrl = imgEl.src;
  } else if (imgEl instanceof Blob) {
    imageUrl = URL.createObjectURL(imgEl);
  } else {
    imageUrl = imgEl;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const predictions: any[] = await imageClassificationPipeline(imageUrl, { topk: 5 });
  
  const mappedPredictions = predictions.map((p) => ({
    className: p.label,
    probability: p.score
  }));

  return mapMobileNetToWasteCategory(mappedPredictions);
};

/**
 * Classifies an image tensor (or URL/Blob) without sending a notification.
 */
export const classifyTensor = async (imageInput: string | Blob): Promise<ClassificationResult> => {
  if (!imageClassificationPipeline) {
    throw new Error('Classification model not loaded. Call loadClassificationModel first.');
  }
  
  let imageUrl: string;
  if (imageInput instanceof Blob) {
    imageUrl = URL.createObjectURL(imageInput);
  } else {
    imageUrl = imageInput;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const predictions: any[] = await imageClassificationPipeline(imageUrl, { topk: 1 });
  
  return { className: predictions[0].label, probability: predictions[0].score };
};

/**
 * Classifies an image tensor (or URL/Blob) and sends a notification.
 */
export const classifyTensorAndNotify = async (
  imageInput: string | Blob,
  userId: string,
  userRole: 'USER' | 'ADMIN' | 'COLLECTOR',
  progressCallback?: (status: string, progress: number) => void
): Promise<ClassificationResult> => {
  if (!imageClassificationPipeline) {
    throw new Error('Classification model not loaded. Call loadClassificationModel first.');
  }

  try {
    // 1. Classify
    progressCallback?.('classifying', 0.5);
    
    let imageUrl: string;
    if (imageInput instanceof Blob) {
      imageUrl = URL.createObjectURL(imageInput);
    } else {
      imageUrl = imageInput;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const predictions: any[] = await imageClassificationPipeline(imageUrl, { topk: 1 });
    progressCallback?.('classifying', 1);

    // 2. Get top result
    const result: ClassificationResult = {
      className: predictions[0].label,
      probability: predictions[0].score,
    };

    // 3. Send notification
    progressCallback?.('notifying', 0.5);
    await addNotification({
      userId,
      role: userRole,
      title: 'AI Waste Suggestion',
      message: `We think your waste is '${result.className}' with ${Math.round(
        result.probability * 100
      )}% confidence. Please confirm.`,
      type: 'AI-suggestion',
      status: 'unread',
    });
    progressCallback?.('notifying', 1);

    return result;
  } catch (error) {
    console.error('Classification and notification process failed:', error);
    throw error;
  }
};
