(function(){
  const lb = document.getElementById('cx-lightbox');
  const lbImg = document.getElementById('cx-lightbox-img');
  const lbClose = document.getElementById('cx-lightbox-close');
  document.querySelectorAll('[data-lightbox]').forEach(function(img){
    img.addEventListener('click', function(){
      lbImg.src = this.src;
      lbImg.alt = this.alt;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLb(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  lbClose.addEventListener('click', closeLb);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLb(); });
})();