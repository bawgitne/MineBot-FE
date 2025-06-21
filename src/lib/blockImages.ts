interface BlockImageMap {
  [key: string]: string;
}

const blockImages: BlockImageMap = {
  // Nether
  netherrack: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/netherrack.png",
  glowstone: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/glowstone.png",
  quartz_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/nether_quartz_ore.png",
  nether_gold_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/nether_gold_ore.png",
  ancient_debris: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/ancient_debris.png",
  soul_sand: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/soul_sand.png",
  soul_soil: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/soul_soil.png",

  // Overworld Ores
  coal_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/coal_ore.png",
  iron_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/iron_ore.png",
  gold_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/gold_ore.png",
  diamond_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/diamond_ore.png",
  emerald_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/emerald_ore.png",
  lapis_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/lapis_ore.png",
  redstone_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/redstone_ore.png",
  copper_ore: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/copper_ore.png",

  // Stone Variants
  stone: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/stone.png",
  cobblestone: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/cobblestone.png",
  andesite: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/andesite.png",
  diorite: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/diorite.png",
  granite: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/granite.png",
  tuff: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/tuff.png",
  deepslate: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/deepslate.png",

  // Wood Logs
  oak_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/oak_log.png",
  spruce_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/spruce_log.png",
  birch_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/birch_log.png",
  jungle_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/jungle_log.png",
  acacia_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/acacia_log.png",
  dark_oak_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/dark_oak_log.png",
  mangrove_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/mangrove_log.png",
  cherry_log: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/cherry_log.png",

  // Fallback / Default
  default: "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/grass_block_side.png",
  "N/A": "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.2/assets/minecraft/textures/block/barrier.png",
};

export const getBlockImageUrl = (blockId: string): string => {
  const normalizedId = blockId.replace("minecraft:", "").toLowerCase();
  return blockImages[normalizedId] || blockImages.default;
};
