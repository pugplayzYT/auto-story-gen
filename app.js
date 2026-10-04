import {personalize, markOccurrences, examples} from './story.js';
const $ = id => document.getElementById(id);
let characters = [], nextId = 1, selection = {start:0,end:0};
function addCharacter(original='', replacement='') {characters.push({id:`character-${nextId++}`,original,replacement}); renderCharacters(); update();}
function renderCharacters() {
  $('characters').replaceChildren(); $('mark-target').replaceChildren(new Option('Choose a character',''));
  characters.forEach((c,index) => {
    const row=document.createElement('div'); row.className='character-row';
    const num=document.createElement('span'); num.className='character-number'; num.textContent=String(index+1).padStart(2,'0'); row.append(num);
    for (const [key,label] of [['original','Original name'],['replacement','New name']]) {
      const wrap=document.createElement('label'); wrap.textContent=label;
      const input=document.createElement('input'); input.value=c[key]; input.placeholder=key==='original'?'e.g. Maya':'e.g. your name';
      input.addEventListener('input',()=>{c[key]=input.value; if(key==='original') $('mark-target').querySelector(`option[value="${c.id}"]`).textContent=c.original||`Character ${index+1}`; update();}); wrap.append(input); row.append(wrap);
    }
    const mark=document.createElement('button'); mark.className='small-button'; mark.textContent='Mark all'; mark.addEventListener('click',()=>{if(!c.original.trim()){announce('Enter the original name first.');return;} const before=$('story').value; $('story').value=markOccurrences(before,c.original,c.id); update(); announce(before===$('story').value?'No unmarked matches found.':`Marked occurrences of ${c.original}.`);}); row.append(mark);
    const remove=document.createElement('button'); remove.className='remove'; remove.textContent='×'; remove.setAttribute('aria-label',`Remove character ${index+1}`); remove.addEventListener('click',()=>{$('story').value=$('story').value.split(`{{${c.id}}}`).join(c.original);characters=characters.filter(x=>x!==c);renderCharacters();update();}); row.append(remove);
    $('characters').append(row); $('mark-target').add(new Option(c.original||`Character ${index+1}`,c.id));
  });
}
function update() {
  const story=$('story').value, result=personalize(story,characters);
  $('preview').classList.toggle('empty',!story.trim());
  if(story.trim()) $('preview').textContent=result; else { $('preview').replaceChildren(); const title=document.createTextNode('A new adventure is waiting.');const br=document.createElement('br');const sub=document.createElement('span');sub.textContent='Add your story to bring it to life.';$('preview').append(title,br,sub); }
  $('word-count').textContent=`${story.trim()?story.trim().split(/\s+/).length:0} words`;
  $('copy').disabled=!result.trim(); const n=(story.match(/\{\{character-\d+\}\}/g)||[]).length; $('replacement-count').textContent=n?`${n} marked name${n===1?'':'s'}`:'Make the story your own';
}
function announce(message){$('status').textContent=message;}
$('story').addEventListener('input',update);
for(const event of ['select','keyup','mouseup']) $('story').addEventListener(event,()=>{selection={start:$('story').selectionStart,end:$('story').selectionEnd};});
$('mark').addEventListener('click',()=>{const id=$('mark-target').value;if(!id){announce('Choose a character first.');return;}if(selection.start===selection.end){announce('Select a name in the story first.');return;}const story=$('story').value, selected=story.slice(selection.start,selection.end);if(/[{}\n]/.test(selected)){announce('Select only a name, without existing markers.');return;}$('story').value=story.slice(0,selection.start)+`{{${id}}}`+story.slice(selection.end);selection={start:0,end:0};update();announce('Selected name marked.');});
$('add').addEventListener('click',()=>addCharacter());
function reset(){characters=[];nextId=1;$('story').value='';renderCharacters();update();announce('');}
$('clear').addEventListener('click',()=>{if($('story').value.trim()&&!confirm('Clear this story and its characters?'))return;reset();addCharacter();});
$('copy').addEventListener('click',async()=>{const output=personalize($('story').value,characters);try{await navigator.clipboard.writeText(output);announce('Story copied to clipboard.');}catch{const area=document.createElement('textarea');area.value=output;document.body.append(area);area.select();const copied=document.execCommand('copy');area.remove();announce(copied?'Story copied to clipboard.':'Copy unavailable. Select the preview text and copy it manually.');}});
examples.forEach((example,index)=>{const button=document.createElement('button');button.className='example-card';const tag=document.createElement('span');tag.className='example-tag';tag.textContent=`0${index+1} / ${example.tag}`;const title=document.createElement('strong');title.textContent=example.title;const description=document.createElement('span');description.textContent=example.story.split('\n')[0];const arrow=document.createElement('span');arrow.className='example-arrow';arrow.textContent='Try this story ↗';button.append(tag,title,description,arrow);button.addEventListener('click',()=>{if($('story').value.trim()&&!confirm('Replace your current story with this example?'))return;reset();$('story').value=example.story;example.names.forEach(name=>addCharacter(name));characters.forEach(c=>{$('story').value=markOccurrences($('story').value,c.original,c.id);});update();announce(`${example.title} loaded. Enter new names to personalize it.`);});$('examples').append(button);});
addCharacter();
