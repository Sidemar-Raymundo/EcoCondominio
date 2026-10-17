// script principal do projeto - js puro

document.addEventListener('DOMContentLoaded', () => {
  // navegacao entre as telas
  const navButtons = document.querySelectorAll('.nav-btn');
  const screens = document.querySelectorAll('.screen');
  const quickNavTriggers = document.querySelectorAll('[data-goto]');

  function navigateToScreen(targetScreenId) {
    if (!targetScreenId) return;

    screens.forEach(screen => {
      if (screen.id === `screen-${targetScreenId}`) {
        screen.classList.add('active');
      } else {
        screen.classList.remove('active');
      }
    });

    navButtons.forEach(btn => {
      if (btn.dataset.screen === targetScreenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      navigateToScreen(target);
    });
  });

  quickNavTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.dataset.goto;
      navigateToScreen(target);
    });
  });

  // logica da coleta do dia
  function updateTodayCard() {
    const hojeDataEl = document.getElementById('hoje-data-extenso');
    const hojeTituloEl = document.getElementById('hoje-coleta-titulo');
    const hojeDescEl = document.getElementById('hoje-coleta-desc');
    const hojeIconeEl = document.getElementById('hoje-coleta-icone');

    if (!hojeTituloEl) return;

    const agora = new Date();
    const diaSemana = agora.getDay();

    const nomesDias = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const diaStr = `${nomesDias[diaSemana]}, ${agora.getDate()} de ${meses[agora.getMonth()]}`;
    if (hojeDataEl) hojeDataEl.textContent = diaStr;

    switch (diaSemana) {
      case 1:
        if (hojeIconeEl) hojeIconeEl.textContent = '♻️';
        hojeTituloEl.textContent = 'HOJE: Coleta Seletiva de Secos (A partir das 19h)';
        hojeDescEl.textContent = 'Plásticos, papéis, papelão desmontado e latas limpas no container de recicláveis.';
        break;
      case 2:
        if (hojeIconeEl) hojeIconeEl.textContent = '🗑️';
        hojeTituloEl.textContent = 'HOJE: Coleta Convencional de Rejeitos/Lixo comum (A partir das 07h)';
        hojeDescEl.textContent = 'Rejeitos a partir das 7h. Lixo comum, que não pode ser reciclado.';
        break;
      case 3:
        if (hojeIconeEl) hojeIconeEl.textContent = '🫙';
        hojeTituloEl.textContent = 'HOJE: Coleta Só de Vidros - Flex (A partir das 07h)';
        hojeDescEl.textContent = 'Garrafas, potes, frascos, copos e taças (podem ser entregues vidros quebrados). Remova as tampas e limpe os recipientes.';
        break;
      case 4:
        if (hojeIconeEl) hojeIconeEl.textContent = '🗑️';
        hojeTituloEl.textContent = 'HOJE: Coleta Convencional de Rejeitos/Lixo comum (A partir das 07h)';
        hojeDescEl.textContent = 'Rejeitos a partir das 7h. Lixo comum, que não pode ser reciclado.';
        break;
      case 5:
        if (hojeIconeEl) hojeIconeEl.textContent = '⏰';
        hojeTituloEl.textContent = 'Sexta: Sem Coleta Comcap Hoje';
        hojeDescEl.textContent = 'Amanhã (Sábado) a partir das 07h haverá Coleta de Rejeitos (lixo comum).';
        break;
      case 6:
        if (hojeIconeEl) hojeIconeEl.textContent = '🗑️';
        hojeTituloEl.textContent = 'HOJE: Coleta Convencional de Rejeitos/Lixo comum (A partir das 07h)';
        hojeDescEl.textContent = 'Rejeitos a partir das 7h. Lixo comum, que não pode ser reciclado.';
        break;
      case 0:
      default:
        if (hojeIconeEl) hojeIconeEl.textContent = '📅';
        hojeTituloEl.textContent = 'Domingo: Prepare os Recicláveis';
        hojeDescEl.textContent = 'Amanhã (Segunda-feira) a partir das 19h da noite é dia de Coleta Seletiva (plásticos, papéis e metais). Separe seus materiais!';
        break;
    }
  }

  updateTodayCard();

  // calendario interativo do mes
  const calGridEl = document.getElementById('cal-grid-dias');
  const calMesAnoTituloEl = document.getElementById('cal-mes-ano-titulo');
  const calBtnPrev = document.getElementById('cal-btn-prev');
  const calBtnNext = document.getElementById('cal-btn-next');
  const calDetalhesDataEl = document.getElementById('cal-detalhes-data');
  const calDetalhesListaEl = document.getElementById('cal-detalhes-lista');

  const datasVerdes2026 = new Set([
    '2026-01-12', '2026-02-02', '2026-02-23', '2026-03-16',
    '2026-04-14', '2026-05-05', '2026-05-26', '2026-06-16',
    '2026-07-07', '2026-07-28', '2026-08-18', '2026-09-09',
    '2026-09-29', '2026-10-20', '2026-11-10', '2026-12-01',
    '2026-12-22'
  ]);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const nomesDiasCompletos = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  let currentCalDate = new Date();
  let selectedCalDay = currentCalDate.getDate();
  let selectedCalMonth = currentCalDate.getMonth();
  let selectedCalYear = currentCalDate.getFullYear();

  function getColetasDoDia(ano, mes, dia, diaSemana) {
    const coletas = [];
    const mesFormatado = String(mes + 1).padStart(2, '0');
    const diaFormatado = String(dia).padStart(2, '0');
    const dataIso = `${ano}-${mesFormatado}-${diaFormatado}`;

    if (diaSemana === 2 || diaSemana === 4 || diaSemana === 6) {
      coletas.push({
        tipo: 'rejeitos',
        nome: 'Rejeitos',
        horario: 'A partir das 7h • Lixo comum, que não pode ser reciclado',
        cor: '#f59e0b'
      });
    }

    if (diaSemana === 1) {
      coletas.push({
        tipo: 'seletiva',
        nome: 'Recicláveis secos',
        horario: 'A partir das 19h • Plásticos, papéis, papelão e metais limpos',
        cor: '#3b82f6'
      });
    }

    if (diaSemana === 3) {
      coletas.push({
        tipo: 'vidro',
        nome: 'Vidro',
        horario: 'A partir das 7h • Garrafas, potes, frascos, copos e taças (podem ser entregues vidros quebrados)',
        cor: '#a855f7'
      });
    }

    if (datasVerdes2026.has(dataIso)) {
      coletas.push({
        tipo: 'verdes',
        nome: 'Verdes',
        horario: 'A partir das 7h • Podas e galhos amarrados em feixes ou sacos de ráfia',
        cor: '#10b981'
      });
    }

    return coletas;
  }

  function renderizarDetalhesDia(ano, mes, dia) {
    const dataObj = new Date(ano, mes, dia);
    const diaSemana = dataObj.getDay();
    const nomeDiaSemana = nomesDiasCompletos[diaSemana];
    const nomeMes = nomesMeses[mes].toLowerCase();

    if (calDetalhesDataEl) {
      calDetalhesDataEl.textContent = `${nomeDiaSemana}, ${dia} de ${nomeMes}`;
    }

    const coletas = getColetasDoDia(ano, mes, dia, diaSemana);

    if (calDetalhesListaEl) {
      if (coletas.length === 0) {
        calDetalhesListaEl.innerHTML = `
          <div class="cal-detalhes-item">
            <span class="cal-tag-pill sem-coleta">Sem Coleta</span>
            <span>Nenhuma coleta agendada pela Comcap neste dia. Mantenha os resíduos no seu apartamento/casa.</span>
          </div>
        `;
      } else {
        calDetalhesListaEl.innerHTML = coletas.map(c => `
          <div class="cal-detalhes-item">
            <span class="cal-tag-pill ${c.tipo}">${c.nome}</span>
            <span>${c.horario}</span>
          </div>
        `).join('');
      }
    }
  }

  function renderCalendar() {
    if (!calGridEl || !calMesAnoTituloEl) return;

    const ano = currentCalDate.getFullYear();
    const mes = currentCalDate.getMonth();

    calMesAnoTituloEl.textContent = `${nomesMeses[mes]} de ${ano}`;

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

    const hojeReal = new Date();
    const isAnoMesAtual = (hojeReal.getFullYear() === ano && hojeReal.getMonth() === mes);

    calGridEl.innerHTML = '';

    for (let i = 0; i < primeiroDiaSemana; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-cell empty';
      calGridEl.appendChild(emptyCell);
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const dataDia = new Date(ano, mes, dia);
      const diaSemana = dataDia.getDay();
      const coletas = getColetasDoDia(ano, mes, dia, diaSemana);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';

      const isToday = isAnoMesAtual && (hojeReal.getDate() === dia);
      if (isToday) {
        cell.classList.add('today');
      }

      const isSelected = (selectedCalYear === ano && selectedCalMonth === mes && selectedCalDay === dia);
      if (isSelected) {
        cell.classList.add('selected');
      }

      const numSpan = document.createElement('span');
      numSpan.className = 'cal-cell-numero';
      numSpan.textContent = dia;
      cell.appendChild(numSpan);

      if (coletas.length > 0) {
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'cal-dots-wrap';
        coletas.forEach(c => {
          const dot = document.createElement('span');
          dot.className = `cal-dot ${c.tipo}`;
          dotsWrap.appendChild(dot);
        });
        cell.appendChild(dotsWrap);
      }

      cell.addEventListener('click', () => {
        selectedCalDay = dia;
        selectedCalMonth = mes;
        selectedCalYear = ano;

        document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');

        renderizarDetalhesDia(ano, mes, dia);
      });

      calGridEl.appendChild(cell);
    }

    renderizarDetalhesDia(selectedCalYear, selectedCalMonth, selectedCalDay);
  }

  if (calBtnPrev) {
    calBtnPrev.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      selectedCalDay = 1;
      selectedCalMonth = currentCalDate.getMonth();
      selectedCalYear = currentCalDate.getFullYear();
      renderCalendar();
    });
  }

  if (calBtnNext) {
    calBtnNext.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      selectedCalDay = 1;
      selectedCalMonth = currentCalDate.getMonth();
      selectedCalYear = currentCalDate.getFullYear();
      renderCalendar();
    });
  }

  renderCalendar();

  // accordions dos horarios e dicas
  const agendaAccBtns = document.querySelectorAll('.agenda-acc-btn');
  agendaAccBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.agenda-acc-card');
      const isAlreadyOpen = card.classList.contains('open');

      if (isAlreadyOpen) {
        card.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const btnToggleAllAccordions = document.getElementById('btn-toggle-accordions');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isAlreadyOpen = item.classList.contains('open');

      if (isAlreadyOpen) {
        item.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (btnToggleAllAccordions) {
    let allOpen = false;
    btnToggleAllAccordions.addEventListener('click', () => {
      allOpen = !allOpen;
      accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (allOpen) {
          item.classList.add('open');
          if (header) header.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open');
          if (header) header.setAttribute('aria-expanded', 'false');
        }
      });
      btnToggleAllAccordions.textContent = allOpen ? '▲ Recolher Todos' : '▼ Expandir Todos';
    });
  }

  const btnToggleDicasAccordions = document.getElementById('btn-toggle-dicas-accordions');
  if (btnToggleDicasAccordions) {
    let allDicasOpen = false;
    btnToggleDicasAccordions.addEventListener('click', () => {
      allDicasOpen = !allDicasOpen;
      const dicasCards = document.querySelectorAll('.dicas-accordions-lista .agenda-acc-card');
      dicasCards.forEach(card => {
        const btn = card.querySelector('.agenda-acc-btn');
        if (allDicasOpen) {
          card.classList.add('open');
          if (btn) btn.setAttribute('aria-expanded', 'true');
        } else {
          card.classList.remove('open');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      btnToggleDicasAccordions.textContent = allDicasOpen ? '▲ Recolher Todos' : '▼ Expandir Todos';
    });
  }

  // busca rapida no guia
  const buscaInput = document.getElementById('campo-busca-guia');
  const contadorBusca = document.getElementById('contador-busca');
  const btnLimparBusca = document.getElementById('btn-limpar-busca');

  if (buscaInput) {
    buscaInput.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase().trim();
      let encontrados = 0;

      accordionItems.forEach(item => {
        const conteudo = item.textContent.toLowerCase();
        const header = item.querySelector('.accordion-header');

        if (termo === '') {
          item.style.display = 'block';
          item.classList.remove('open');
          if (header) header.setAttribute('aria-expanded', 'false');
        } else if (conteudo.includes(termo)) {
          item.style.display = 'block';
          item.classList.add('open');
          if (header) header.setAttribute('aria-expanded', 'true');
          encontrados++;
        } else {
          item.style.display = 'none';
          item.classList.remove('open');
          if (header) header.setAttribute('aria-expanded', 'false');
        }
      });

      if (contadorBusca) {
        if (termo === '') {
          contadorBusca.textContent = 'Toque em um material para ver detalhes';
        } else {
          contadorBusca.textContent = `${encontrados} grupo(s) encontrado(s) para "${termo}"`;
        }
      }

      if (btnLimparBusca) {
        btnLimparBusca.style.display = termo !== '' ? 'inline-block' : 'none';
      }
    });

    if (btnLimparBusca) {
      btnLimparBusca.addEventListener('click', () => {
        buscaInput.value = '';
        buscaInput.dispatchEvent(new Event('input'));
        buscaInput.focus();
      });
    }
  }

  // compartilhar e copiar link
  const currentAppUrl = window.location.href && !window.location.href.startsWith('about:') && !window.location.href.startsWith('blob:')
    ? window.location.href.split('#')[0]
    : 'https://ais-pre-4quqfs2e3qp4varil2mwue-485239060533.us-west1.run.app';

  const linkExibicao = document.getElementById('app-url-display');
  const qrImage = document.getElementById('img-qrcode-app');
  const btnCopiar = document.getElementById('btn-copiar-link');
  const btnCompartilharNativo = document.getElementById('btn-compartilhar-nativo');
  const btnWhatsAppGeral = document.getElementById('btn-whatsapp-geral');

  if (linkExibicao) {
    linkExibicao.textContent = currentAppUrl;
  }

  if (qrImage) {
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentAppUrl)}&color=064e3b`;
  }

  if (btnWhatsAppGeral) {
    const textoZap = `🌿 *EcoCondomínio Villa di Lucca*\nAcesse o aplicativo dos moradores com os horários de coleta da Comcap e guia de descarte:\n${currentAppUrl}`;
    btnWhatsAppGeral.href = `https://wa.me/?text=${encodeURIComponent(textoZap)}`;
  }

  if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(currentAppUrl);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = currentAppUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        btnCopiar.innerHTML = '✅ Link Copiado!';
        btnCopiar.style.background = '#059669';
        btnCopiar.style.color = '#ffffff';

        setTimeout(() => {
          btnCopiar.innerHTML = '📋 Copiar Link';
          btnCopiar.style.background = '#e2e8f0';
          btnCopiar.style.color = '#0f172a';
        }, 2500);
      } catch (err) {
        console.warn('Erro ao copiar link:', err);
      }
    });
  }

  if (btnCompartilharNativo) {
    if (navigator.share) {
      btnCompartilharNativo.style.display = 'flex';
      btnCompartilharNativo.addEventListener('click', async () => {
        try {
          await navigator.share({
            title: 'EcoCondomínio • Villa di Lucca',
            text: 'Guia de coleta e educação ambiental do Condomínio Villa di Lucca em Vargem Grande:',
            url: currentAppUrl
          });
        } catch (shareErr) {
          console.warn('Compartilhamento cancelado:', shareErr);
        }
      });
    } else {
      btnCompartilharNativo.style.display = 'none';
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
          console.log('PWA ServiceWorker registrado com sucesso:', reg.scope);
        })
        .catch(err => {
          console.warn('Falha ao registrar ServiceWorker:', err);
        });
    });
  }

  // aviso pra instalar o pwa no celular
  let deferredPrompt = null;
  const btnInstalarHeader = document.getElementById('btn-instalar-header');
  const bannerInstalarHome = document.getElementById('banner-instalar-home');
  const btnInstalarBanner = document.getElementById('btn-instalar-banner');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (btnInstalarHeader) btnInstalarHeader.style.display = 'inline-block';
    if (bannerInstalarHome) bannerInstalarHome.style.display = 'block';
  });

  async function triggerInstallPrompt() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      if (btnInstalarHeader) btnInstalarHeader.style.display = 'none';
      if (bannerInstalarHome) bannerInstalarHome.style.display = 'none';
    }
    deferredPrompt = null;
  }

  if (btnInstalarHeader) {
    btnInstalarHeader.addEventListener('click', triggerInstallPrompt);
  }
  if (btnInstalarBanner) {
    btnInstalarBanner.addEventListener('click', triggerInstallPrompt);
  }

  const offlineBanner = document.getElementById('offline-banner');

  function updateOnlineStatus() {
    if (!offlineBanner) return;
    if (navigator.onLine) {
      offlineBanner.style.display = 'none';
    } else {
      offlineBanner.style.display = 'block';
      offlineBanner.textContent = '📶 Modo Offline ativado: Todas as informações e horários continuam disponíveis!';
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});
