document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
if(toggle&&nav){toggle.hidden=false;toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});nav.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});}
const form=document.querySelector('#quote-form');
if(form){
 const query=new URLSearchParams(location.search);
 for(const field of ['from','to'])form.elements[field].value=(query.get(field)||'').slice(0,100);
 const now=new Date();const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;form.elements.date.min=today;
 let message='';let contact={};
 const contactReady=fetch('/assets/contact.json').then(r=>{if(!r.ok)throw Error('Contact unavailable');return r.json();}).then(value=>{contact=value;}).catch(()=>{});
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  for(const el of form.querySelectorAll('input[required]')){el.value=el.value.trim();}
  if(!form.reportValidity())return;
  const data=new FormData(form);
  message=`Car transport enquiry — Hirosh Roadways\n\nPickup: ${data.get('from')}\nDelivery: ${data.get('to')}\nCar: ${data.get('car')}\nPreferred pickup: ${data.get('date')}\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nNotes: ${data.get('notes')||'None'}\n\nPlease confirm availability, total charges, inclusions and the expected schedule.`;
  document.querySelector('#enquiry-text').textContent=message;
  await contactReady;
  const options=document.querySelector('#send-options');options.replaceChildren();
  const add=(label,href)=>{const a=document.createElement('a');a.className='button';a.textContent=label;a.href=href;options.append(a);};
  if(contact.whatsapp)add('Continue to WhatsApp',`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`);
  if(contact.email)add('Open in email',`mailto:${contact.email}?subject=${encodeURIComponent('Car transport quote enquiry')}&body=${encodeURIComponent(message)}`);
  document.querySelector('#enquiry-status').textContent=contact.whatsapp||contact.email?'Send the message in WhatsApp or your email app to complete your enquiry.':'Direct enquiry channels are not available yet. Download your enquiry to keep a copy; nothing has been sent.';
  document.querySelector('#enquiry-result').hidden=false;document.querySelector('#result-title').focus();
 });
 form.addEventListener('input',()=>{document.querySelector('#enquiry-result').hidden=true;});
 document.querySelector('#download-enquiry').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([message],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='hirosh-car-transport-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#enquiry-status').textContent='Download requested. This enquiry has not been sent to Hirosh Roadways.';});
}
