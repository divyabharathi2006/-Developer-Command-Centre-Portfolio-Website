(() => {
  'use strict';

  const data = window.PORTFOLIO_DATA;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeText = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  // Bind all profile details and approved profile URLs from the data module.
  $$('[data-profile="name"]').forEach((node) => { node.textContent = data.name; });
  $$('[data-profile="location"]').forEach((node) => { node.textContent = data.location; });
  $$('[data-profile="summary"]').forEach((node) => { node.textContent = data.summary; });
  $$('[data-profile="education-duration"]').forEach((node) => { node.textContent = data.education.duration; });
  $$('[data-profile="education-institution"]').forEach((node) => { node.textContent = data.education.institution; });
  $$('[data-profile="education-campus"]').forEach((node) => { node.textContent = data.education.campus; });
  $$('[data-profile-link="email"]').forEach((node) => {
    node.href = `mailto:${data.email}`;
    if (node.tagName === 'A' && !node.textContent.trim()) node.textContent = data.email;
  });
  $$('[data-profile-link="phone"]').forEach((node) => {
    node.href = `tel:${data.phone.replace(/\s/g, '')}`;
    if (node.tagName === 'A' && !node.textContent.trim()) node.textContent = data.phone;
  });
  $$('[data-profile-link="github"]').forEach((node) => { node.href = data.links.github; });
  $$('[data-profile-link="linkedin"]').forEach((node) => { node.href = data.links.linkedin; });

  const factItems = [
    ['NAME', data.name],
    ['DEGREE', data.education.degree],
    ['INSTITUTION', data.education.institution],
    ['STATUS', data.education.duration],
    ['LOCATION', data.location],
    ['CAMPUS', data.education.campus]
  ];
  const facts = $('#about-facts');
  factItems.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'fact-card reveal';
    const heading = document.createElement('span');
    heading.textContent = label;
    const content = document.createElement('strong');
    content.textContent = value;
    card.append(heading, content);
    facts.append(card);
  });

  const skillsGrid = $('#skills-grid');
  data.skillGroups.forEach((group) => {
    const card = document.createElement('article');
    card.className = 'skill-card reveal';
    const head = document.createElement('div');
    head.className = 'skill-head';
    const title = document.createElement('h3');
    title.textContent = group.title;
    const code = document.createElement('span');
    code.className = 'skill-code';
    code.textContent = group.code;
    head.append(title, code);
    const tags = document.createElement('div');
    tags.className = 'skill-tags';
    group.items.forEach((item) => {
      const tag = document.createElement('button');
      tag.type = 'button';
      tag.className = 'skill-tag';
      tag.textContent = item;
      tag.setAttribute('aria-label', `${item}, listed skill`);
      tag.addEventListener('click', () => {
        $$('.skill-tag.is-selected', skillsGrid).forEach((selected) => {
          selected.classList.remove('is-selected');
          selected.setAttribute('aria-pressed', 'false');
        });
        tag.classList.add('is-selected');
        tag.setAttribute('aria-pressed', 'true');
        showToast(`${item} — listed in the resume.`);
      });
      tag.setAttribute('aria-pressed', 'false');
      tags.append(tag);
    });
    card.append(head, tags);
    skillsGrid.append(card);
  });

  const projectsGrid = $('#projects-grid');
  data.projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card reveal';
    card.innerHTML = `
      <div class="project-top"><span class="project-index">PROJECT ${escapeText(project.id)}</span><span class="project-type">${escapeText(project.category.toUpperCase())}</span></div>
      <h3>${escapeText(project.name)}</h3>
      <p>${escapeText(project.description || 'Academic project listed in the resume. No further description provided.')}</p>
      <div class="project-tech" aria-label="Technologies">${project.technologies.map((technology) => `<span>${escapeText(technology)}</span>`).join('')}</div>
      <div class="project-bottom"><span class="project-status"><span class="status-dot"></span> ${escapeText(project.status.toUpperCase())}</span><button class="project-details" type="button" data-project-id="${escapeText(project.id)}">VIEW DETAILS ↗</button></div>`;
    projectsGrid.append(card);
  });

  const certificationList = $('#cert-list');
  data.certifications.forEach((certification) => {
    const item = document.createElement('li');
    item.textContent = certification;
    item.className = 'reveal';
    certificationList.append(item);
  });

  const journeyTrack = $('#journey-track');
  data.journey.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'journey-item reveal';
    const number = document.createElement('span');
    number.className = 'journey-index';
    number.textContent = `STEP ${String(index + 1).padStart(2, '0')}`;
    const label = document.createElement('span');
    label.textContent = step;
    item.append(number, label);
    journeyTrack.append(item);
  });

  // Light boot sequence. Skip remains available throughout the intro.
  const bootScreen = $('#boot-screen');
  const bootLines = $('#boot-lines');
  const bootMessages = [
    'Initializing developer command center...',
    'Loading profile...',
    'Loading technical skills...',
    'Loading projects...',
    'Loading certifications...',
    'Loading achievements...',
    'System status: online',
    'Welcome, Divyabharathi V.'
  ];
  let bootTimer;
  let bootIndex = 0;
  const finishBoot = () => {
    window.clearInterval(bootTimer);
    bootScreen.classList.add('is-done');
    window.setTimeout(() => bootScreen.remove(), 650);
  };
  $('#skip-intro').addEventListener('click', finishBoot);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishBoot();
  } else {
    const showBootLine = () => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.style.animationDelay = '0ms';
      line.textContent = `> ${bootMessages[bootIndex]}`;
      bootLines.append(line);
      bootIndex += 1;
      if (bootIndex >= bootMessages.length) {
        window.clearInterval(bootTimer);
        bootTimer = window.setTimeout(finishBoot, 360);
      }
    };
    bootTimer = window.setInterval(showBootLine, 190);
    showBootLine();
  }

  // Responsive navigation closes after selection and supports Escape.
  const menuToggle = $('#menu-toggle');
  const primaryNav = $('#primary-nav');
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryNav.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !isOpen);
  });
  $$('#primary-nav a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Project detail dialog contains only resume-supported descriptions and features.
  const projectDialog = $('#project-dialog');
  const dialogContent = $('#dialog-content');
  const openProject = (project) => {
    $('#dialog-number').textContent = project.id;
    dialogContent.replaceChildren();
    const title = document.createElement('h2');
    title.className = 'dialog-project-title';
    title.id = 'dialog-title';
    title.textContent = project.name;
    const category = document.createElement('p');
    category.className = 'dialog-category';
    category.textContent = project.category.toUpperCase();
    dialogContent.append(title, category);
    const description = document.createElement('p');
    description.className = 'dialog-description';
    description.textContent = project.description || 'This project is listed in the resume. No additional description was provided.';
    dialogContent.append(description);
    const technologyHeading = document.createElement('h4');
    technologyHeading.textContent = 'TECHNOLOGIES';
    const technologyList = document.createElement('ul');
    technologyList.className = 'dialog-features';
    project.technologies.forEach((technology) => {
      const item = document.createElement('li');
      item.textContent = technology;
      technologyList.append(item);
    });
    const technologySection = document.createElement('div');
    technologySection.className = 'dialog-meta';
    technologySection.append(technologyHeading, technologyList);
    dialogContent.append(technologySection);
    if (project.features?.length) {
      const featureHeading = document.createElement('h4');
      featureHeading.textContent = 'FEATURES';
      const featureList = document.createElement('ul');
      featureList.className = 'dialog-features';
      project.features.forEach((feature) => {
        const item = document.createElement('li');
        item.textContent = feature;
        featureList.append(item);
      });
      const featureSection = document.createElement('div');
      featureSection.className = 'dialog-meta';
      featureSection.append(featureHeading, featureList);
      dialogContent.append(featureSection);
    }
    projectDialog.showModal();
  };
  projectsGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project-id]');
    if (!button) return;
    const project = data.projects.find((item) => item.id === button.dataset.projectId);
    if (project) openProject(project);
  });
  $('#dialog-close').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });

  // Terminal: command output is built with text nodes to keep user input inert.
  const terminalForm = $('#terminal-form');
  const terminalInput = $('#terminal-input');
  const terminalOutput = $('#terminal-output');
  const commandHistory = [];
  let historyIndex = 0;
  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }
  function addTerminalLine(text, className = 'terminal-result') {
    const line = document.createElement('p');
    line.className = className;
    line.textContent = text;
    terminalOutput.append(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  function addTerminalLink(label, url) {
    const line = document.createElement('p');
    line.className = 'terminal-result';
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    line.append(anchor);
    terminalOutput.append(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  const terminalCommands = {
    help: () => addTerminalLine('Available: help, about, whoami, skills, projects, education, certifications, hackathon, github, linkedin, contact, resume, neofetch, clear'),
    about: () => { addTerminalLine(data.summary); $('#about').scrollIntoView({ behavior: 'smooth' }); },
    whoami: () => addTerminalLine(`${data.name} — ${data.role}. Focus: Python Full Stack Development, Data Analysis, Prompt Engineering.`),
    skills: () => {
      data.skillGroups.forEach((group) => addTerminalLine(`${group.title}: ${group.items.join(', ')}`));
      $('#skills').scrollIntoView({ behavior: 'smooth' });
    },
    projects: () => {
      data.projects.forEach((project) => addTerminalLine(`${project.id} / ${project.name} — ${project.technologies.join(', ')}`));
      $('#projects').scrollIntoView({ behavior: 'smooth' });
    },
    education: () => {
      addTerminalLine(`${data.education.degree} — ${data.education.institution}, ${data.education.duration}, ${data.education.campus}.`);
      $('#education').scrollIntoView({ behavior: 'smooth' });
    },
    certifications: () => {
      data.certifications.forEach((certification) => addTerminalLine(certification));
      $('#education').scrollIntoView({ behavior: 'smooth' });
    },
    certification: () => terminalCommands.certifications(),
    hackathon: () => { addTerminalLine('Smart Indian Hackathon — listed in the resume.'); $('#hackathon').scrollIntoView({ behavior: 'smooth' }); },
    github: () => addTerminalLink(data.links.github, data.links.github),
    linkedin: () => addTerminalLink(data.links.linkedin, data.links.linkedin),
    contact: () => { addTerminalLine(`${data.email} · ${data.phone} · ${data.location}`); $('#contact').scrollIntoView({ behavior: 'smooth' }); },
    resume: () => addTerminalLine('Resume PDF is not included yet. Add the original file to assets/resume/ to enable resume actions.'),
    neofetch: () => [
      'DIVYABHARATHI V',
      'ROLE      B.E. INFORMATION TECHNOLOGY STUDENT',
      'LANG      Python / JavaScript / C++',
      'WEB       HTML / CSS / Node.js',
      'DATABASE  MySQL',
      'VCS       Git / GitHub',
      'FOCUS     Python Full Stack / Data Analysis / Prompt Engineering',
      'STATUS    ONLINE'
    ].forEach((line) => addTerminalLine(line)),
    clear: () => { terminalOutput.replaceChildren(); }
  };
  const aliases = { certs: 'certifications', certificate: 'certifications', hackathons: 'hackathon', linkedin: 'linkedin' };
  function runCommand(rawCommand) {
    const raw = rawCommand.trim();
    if (!raw) return;
    addTerminalLine(`divyabharathi@developer:~$ ${raw}`, 'terminal-command');
    const name = raw.toLowerCase().split(/\s+/)[0];
    const command = aliases[name] || name;
    if (terminalCommands[command]) terminalCommands[command]();
    else addTerminalLine(`Command not found: ${name}. Type "help" to see available commands.`);
  }
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = terminalInput.value;
    if (command.trim()) {
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      runCommand(command);
    }
    terminalInput.value = '';
  });
  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && commandHistory.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      terminalInput.value = commandHistory[historyIndex];
    }
    if (event.key === 'ArrowDown' && commandHistory.length) {
      event.preventDefault();
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      terminalInput.value = commandHistory[historyIndex] || '';
    }
  });
  $$('.command-link').forEach((button) => button.addEventListener('click', () => {
    runCommand(button.dataset.command);
    terminalInput.focus();
  }));

  // Subtle scroll reveal with a safe fallback for older browsers.
  const revealNodes = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  $('#year').textContent = new Date().getFullYear();
})();
