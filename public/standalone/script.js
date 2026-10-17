// EcoCondomínio - Vila di Lucca • JavaScript Puro (sem frameworks)
document.addEventListener('DOMContentLoaded', () => {
  // Navegação entre as 6 telas
  const navButtons = document.querySelectorAll('.nav-item');
  const screens = document.querySelectorAll('.screen');

  function showScreen(screenId) {
    screens.forEach(screen => {
      screen.classList.remove('active');
      if (screen.id === `screen-${screenId}`) {
        screen.classList.add('active');
      }
    });

    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.screen === screenId) {
        btn.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const screenId = btn.dataset.screen;
      showScreen(screenId);
    });
  });

  // Botões internos de atalho rápido
  const quickLinks = document.querySelectorAll('[data-goto]');
  quickLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.goto;
      showScreen(target);
    });
  });

  // Ações de QR Code e Compartilhamento
  const qrCard = document.getElementById('qrcode-standalone-card');
  const btnScrollQr = document.getElementById('btn-scroll-qr');
  const cardItemQr = document.getElementById('card-item-qrcode');
  const urlDisplay = document.getElementById('standalone-app-url');
  const qrImg = document.getElementById('standalone-qr-img');
  const btnCopy = document.getElementById('btn-copy-standalone');
  const btnWa = document.getElementById('btn-wa-standalone');

  const currentAppUrl = window.location.href && !window.location.href.startsWith('about:') && !window.location.href.startsWith('blob:')
    ? window.location.href
    : 'https://ais-pre-4quqfs2e3qp4varil2mwue-485239060533.us-west1.run.app';

  if (urlDisplay) urlDisplay.textContent = currentAppUrl;
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(currentAppUrl)}&color=064e3b`;
  }
  if (btnWa) {
    btnWa.href = `https://wa.me/?text=${encodeURIComponent(`🌿 *EcoCondomínio Vila di Lucca*\nAcesse o aplicativo dos moradores com os horários de coleta da Comcap e regras de descarte:\n${currentAppUrl}`)}`;
  }

  function scrollToQr() {
    if (qrCard) {
      qrCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnScrollQr) btnScrollQr.addEventListener('click', scrollToQr);
  if (cardItemQr) cardItemQr.addEventListener('click', scrollToQr);

  if (btnCopy) {
    btnCopy.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(currentAppUrl);
        } else {
          const ta = document.createElement('textarea');
          ta.value = currentAppUrl;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        btnCopy.innerHTML = '✅ Copiado!';
        btnCopy.style.background = '#059669';
        setTimeout(() => {
          btnCopy.innerHTML = '📋 Copiar Link';
          btnCopy.style.background = 'rgba(255,255,255,0.15)';
        }, 2500);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    });
  }

  // Busca rápida de materiais no Guia
  const inputBusca = document.getElementById('busca-material');
  const listaItens = document.querySelectorAll('.item-descarte');

  if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase().trim();
      listaItens.forEach(item => {
        const texto = item.textContent.toLowerCase();
        if (texto.includes(termo) || termo === '') {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Filtro de Categorias da Tela Dicas
  const dicasFilterBtns = document.querySelectorAll('.dicas-filter-btn');
  const dicasBlocos = document.querySelectorAll('.dicas-bloco-card');

  if (dicasFilterBtns.length > 0) {
    dicasFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        dicasFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        dicasBlocos.forEach(bloco => {
          const cat = bloco.getAttribute('data-categoria');
          if (filter === 'todos' || filter === cat) {
            bloco.style.display = 'block';
          } else {
            bloco.style.display = 'none';
          }
        });
      });
    });
  }

  // Botão Expandir/Recolher Dicas
  const btnDicasToggle = document.getElementById('btn-toggle-dicas-standalone');
  if (btnDicasToggle) {
    let allOpen = false;
    btnDicasToggle.addEventListener('click', () => {
      allOpen = !allOpen;
      const detailsList = document.querySelectorAll('#screen-dicas details');
      detailsList.forEach(d => {
        d.open = allOpen;
      });
      btnDicasToggle.textContent = allOpen ? '▲ Recolher Todos' : '▼ Expandir Todos';
    });
  }

  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW puro registrado com sucesso!', reg.scope))
      .catch(err => console.log('Falha no SW puro:', err));
  }

  // PWA Install Prompt
  let deferredPrompt;
  const installBtn = document.getElementById('btn-instalar-app');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-block';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }
});
