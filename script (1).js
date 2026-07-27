function submitCycleDeclaration(){
 const email=document.getElementById('memberEmail')?.value.trim();
 const account=document.getElementById('accountMatch')?.value.trim();
 const cycle=document.getElementById('cycleNumber')?.value||'1';
 const plan=Number(document.getElementById('planGb')?.value||0);
 const used=Number(document.getElementById('usedGb')?.value||0);
 const file=document.getElementById('verificationFile')?.files[0];
 const msg=document.getElementById('conversionMessage');
 if(!email||!email.includes('@')){msg.textContent='Enter a valid member email.';return}
 if(!account){msg.textContent='Enter the account name or number shown in the screenshot.';return}
 if(used>plan){msg.textContent='Used data cannot be higher than total plan data.';return}
 if(!file){msg.textContent='Attach a verification screenshot before submitting.';return}
 const unused=Math.max(0,plan-used); const dbus=Math.round(unused*10);
 localStorage.setItem('urbyte_cycle_declaration_'+cycle,JSON.stringify({email,account,cycle,plan,used,unusedGb:unused,previewDbus:dbus,verificationFileName:file.name,status:'preview_saved_pending_backend_storage'}));
 localStorage.setItem('urbyte_preview_dbus',dbus);
 msg.textContent='Preview declaration saved locally. Backend storage is still required before this can become verified.';
}
