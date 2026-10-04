export function personalize(story, characters) {
  const replacements = new Map(characters.map(c => [c.id, c.replacement.trim() || c.original]));
  return story.replace(/\{\{(character-\d+)\}\}/g, (token, id) => replacements.get(id) ?? token);
}
export function markOccurrences(story, name, id) {
  if (!name.trim()) return story;
  const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, 'gu');
  return story.split(/(\{\{character-\d+\}\})/g).map(part => /^\{\{character-\d+\}\}$/.test(part) ? part : part.replace(pattern, `{{${id}}}`)).join('');
}
export const examples = [
  {title:'The midnight library',tag:'A little magic',story:'When Maya found a tiny brass key beneath the library steps, she knew it belonged to something extraordinary.\n\n“Come on, Leo,” Maya whispered. “One quick adventure.”\n\nTogether, Maya and Leo opened a door hidden behind the poetry shelf. Beyond it, a thousand floating books lit up like stars. One drifted toward Maya. On its cover were two words: Your Story.\n\nLeo grinned. “I think this is just the beginning.”',names:['Maya','Leo']},
  {title:'One giant leap',tag:'Out of this world',story:'Alex had practiced this moment a hundred times. Still, the first step onto the moon felt like stepping into a dream.\n\nBack at mission control, Sam waited for the radio to crackle.\n\n“We made it,” Alex said. “And you should see the view.”\n\nSam smiled. All those late nights, all those impossible plans — suddenly, they were worth it. Alex planted a small flag in the silver dust. It read: For everyone who dared to try.',names:['Alex','Sam']},
  {title:'The best rainy day',tag:'Everyday adventures',story:'Charlie had planned a picnic. The rain had other ideas.\n\nSo Charlie and Riley built a blanket fort in the living room, packed sandwiches into a basket, and pretended the carpet was a sunny meadow.\n\nRiley drew a map to a hidden treasure: the last slice of chocolate cake. Charlie followed every clue, laughing the whole way.\n\nBy evening, the rain had stopped. But neither Charlie nor Riley wanted to leave their little adventure behind.',names:['Charlie','Riley']}
];
