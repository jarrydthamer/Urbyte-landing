function join(){
  const e=document.getElementById('email')?.value?.trim();
  const m=document.getElementById('msg');
  if(!e||!e.includes('@')){
    if(m){m.textContent='Enter a valid email.';m.className='status-message error';}
    return;
  }
  localStorage.setItem('urbyte_waitlist_email',e);
  if(m){
    m.textContent='You are on the waitlist. Founding access will reopen when the wallet is ready.';
    m.className='status-message success';
  }
}
