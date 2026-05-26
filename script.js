function join(){
  const e=document.getElementById('email')?.value?.trim();
  const m=document.getElementById('msg');
  if(!e||!e.includes('@')){m.textContent='Enter a valid email.';m.className='status-message error';return}
  localStorage.setItem('urbyte_waitlist_email',e);
  m.textContent='You are on the waitlist. Founding access will reopen when the wallet is ready.';
  m.className='status-message success';
}
function submitCycleDeclaration(){
  const email=document.getElementById('memberEmail').value.trim();
  const accountMatch=document.getElementById('accountMatch').value.trim();
  const cycleNumber=document.getElementById('cycleNumber').value;
  const planType=document.getElementById('planType').value;
  const cycleDate=document.getElementById('cycleDate').value;
  const planGb=Number(document.getElementById('planGb').value||0);
  const usedGb=Number(document.getElementById('usedGb').value||0);
  const file=document.getElementById('verificationFile').files[0];
  const msg=document.getElementById('conversionMessage');
  if(!email||!email.includes('@')){msg.textContent='Enter a valid member email.';msg.className='status-message error';return}
  if(!accountMatch){msg.textContent='Enter the account name or number shown in the screenshot.';msg.className='status-message error';return}
  if(!cycleDate){msg.textContent='Enter the next billing due date or prepaid expiry date.';msg.className='status-message error';return}
  if(usedGb>planGb){msg.textContent='Used data cannot be higher than total plan data.';msg.className='status-message error';return}
  if(!file){msg.textContent='Attach a verification screenshot before submitting.';msg.className='status-message error';return}
  const unusedGb=Math.max(0,planGb-usedGb);
  const previewDbus=Math.round(unusedGb*10);
  const declaration={email,accountMatch,cycleNumber,planType,cycleDate,planGb,usedGb,unusedGb,previewDbus,verificationFileName:file.name,submittedAt:new Date().toISOString(),status:'preview_saved_pending_backend_storage'};
  localStorage.setItem('urbyte_cycle_declaration_'+cycleNumber,JSON.stringify(declaration));
  localStorage.setItem('urbyte_preview_unused_gb',unusedGb);
  localStorage.setItem('urbyte_preview_dbus',previewDbus);
  msg.textContent='Preview declaration saved locally. Backend storage is still required before this can become a verified Urbyte record.';
  msg.className='status-message success';
}
