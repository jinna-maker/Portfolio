const SAMPLE_DATA = {
  Profile: [
    { Publish: "Yes", Visibility: "Public", Field: "Student Name", Public_Value: "Jinna Arunplod" },
    { Publish: "Yes", Visibility: "Public", Field: "Headline", Public_Value: "Robotics • 3D Printing • Coding • Creative Engineering" },
    { Publish: "Yes", Visibility: "Public", Field: "Short Bio", Public_Value: "A student interested in robotics, engineering design, 3D printing, electronics, and creative problem solving." }
  ],
  Projects: [
    {
      Project_ID: "PRJ-2026-001",
      Publish: "Yes",
      Visibility: "Public",
      Year: "2026",
      Category: "Robotics",
      Public_Title: "AirScout RoboDog",
      Short_Summary: "A smart robot dog prototype that can detect abnormal air or gas and respond with movement, sound, and an alert face.",
      Skills: "ESP32; Arduino; Robotics; Sensors; 3D Design",
      Main_Photo_URL: "",
      Demo_Video_URL: "",
      Code_URL: "",
      Report_URL: "",
      Poster_URL: "",
      Highlight_Order: "1"
    },
    {
      Project_ID: "PRJ-2026-002",
      Publish: "Yes",
      Visibility: "Public",
      Year: "2026",
      Category: "3D Printing / Mechanical Design",
      Public_Title: "Portable Pinball",
      Short_Summary: "A compact 3D-printed pinball game with modular obstacles that can be rearranged for different gameplay layouts.",
      Skills: "CAD; 3D Printing; Mechanical Design; Prototyping",
      Main_Photo_URL: "",
      Demo_Video_URL: "",
      Code_URL: "",
      Report_URL: "",
      Poster_URL: "",
      Highlight_Order: "2"
    }
  ],
  Achievements: [],
  Certificates: [],
  Skills: [
    { Publish: "Yes", Visibility: "Public", Skill_Group: "Robotics", Skill_Name: "ESP32 / Arduino", Level: "Beginner+", Description: "Used ESP32 and Arduino code to control robot behavior." },
    { Publish: "Yes", Visibility: "Public", Skill_Group: "Design", Skill_Name: "3D Printing / CAD", Level: "Beginner+", Description: "Designed and built 3D-printed mechanical parts." },
    { Publish: "Yes", Visibility: "Public", Skill_Group: "Soft Skills", Skill_Name: "Presentation", Level: "Developing", Description: "Explains project idea, design, and testing results." }
  ],
  Education: [],
  Media: []
};

const DEFAULT_IMAGE = "assets/img/default_project_cover.svg";

document.addEventListener("DOMContentLoaded", initPortfolio);

async function initPortfolio() {
  setupNav();
  setupImageFallbacks();

  try {
    const configUrl = window.PORTFOLIO_CONFIG?.CONFIG_CSV_URL || "";
    const useSample = window.PORTFOLIO_CONFIG?.USE_SAMPLE_DATA_IF_CONFIG_MISSING;
    const isMissingConfig = !configUrl || configUrl.includes("PASTE_");

    const data = isMissingConfig && useSample
      ? SAMPLE_DATA
      : await loadDataFromConfig(configUrl);

    renderPortfolio(data);
  } catch (error) {
    console.error(error);
    showGlobalError("Could not load portfolio data. Check the Website_Config CSV URL and published tab links.");
  }
}

function setupNav() {
  const button = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  button?.addEventListener("click", () => links?.classList.toggle("open"));
}

function setupImageFallbacks() {
  document.addEventListener("error", event => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;

    const fallback = target.dataset.fallback || DEFAULT_IMAGE;
    if (target.dataset.failed === "1") {
      target.style.display = "none";
      return;
    }

    target.dataset.failed = "1";
    target.src = fallback;
  }, true);
}

async function loadDataFromConfig(configUrl) {
  const configRows = await fetchCSV(configUrl);
  const data = {};

  for (const row of configRows) {
    const key = clean(row.Key);
    const url = clean(row.CSV_URL);
    if (!key || !url || url.includes("PASTE_")) {
      data[key] = [];
      continue;
    }

    data[key] = await fetchCSV(url);
  }

  return data;
}

async function fetchCSV(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load CSV: ${url}`);
  const text = await response.text();
  return parseCSV(text);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(value);
      if (row.some(cell => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some(cell => cell.trim() !== "")) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(cells => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = (cells[index] || "").trim();
    });
    return item;
  });
}

function renderPortfolio(data) {
  const profile = publicRows(data.Profile || []);
  const projects = publicRows(data.Projects || []).sort(orderSort);
  const achievements = publicRows(data.Achievements || []).sort(yearSort);
  const certificates = publicRows(data.Certificates || []).sort(yearSort);
  const skills = publicRows(data.Skills || []);
  const media = publicRows(data.Media || []).sort(yearSort);

  renderProfile(profile);
  renderProjects(projects);
  renderSkills(skills);
  renderAchievements(achievements);
  renderCertificates(certificates);
  renderMedia(media);

  setText("projectCount", projects.length);
  setText("skillCount", skills.length);
  setText("achievementCount", achievements.length);
}

function publicRows(rows) {
  return rows.filter(row =>
    clean(row.Publish).toLowerCase() === "yes" &&
    clean(row.Visibility).toLowerCase() === "public"
  );
}

function renderProfile(rows) {
  const byField = {};
  rows.forEach(row => byField[clean(row.Field)] = clean(row.Public_Value) || clean(row.Value));

  const name = byField["Student Name"] || "Student Portfolio";
  const headline = byField["Headline"] || "Robotics • 3D Printing • Coding • Creative Engineering";
  const bio = byField["Short Bio"] || "Selected public learning evidence and projects.";

  setText("studentName", name);
  setText("brandName", name);
  setText("studentHeadline", headline);
  setText("studentBio", bio);
  document.title = `${name} | Portfolio`;
}

function renderProjects(projects) {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `<div class="empty">No public projects yet.</div>`;
    return;
  }

  grid.innerHTML = projects.map(project => {
    const title = clean(project.Public_Title) || clean(project.Project_Name) || "Untitled Project";
    const image = clean(project.Main_Photo_URL) || DEFAULT_IMAGE;
    return `
      <article class="card">
        ${renderImage(image, title)}
        <div class="card-body">
          <span class="tag">${escapeHTML(clean(project.Category) || "Project")} • ${escapeHTML(clean(project.Year))}</span>
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(clean(project.Short_Summary))}</p>
          <div class="link-row">
            ${linkButton(project.Demo_Video_URL, "Demo")}
            ${linkButton(project.Code_URL, "Code")}
            ${linkButton(project.Report_URL, "Report")}
            ${linkButton(project.Poster_URL, "Poster")}
            ${linkButton(project.Folder_URL, "Folder")}
          </div>
        </div>
      </article>`;
  }).join("");
}

function renderSkills(skills) {
  const target = document.getElementById("skillsList");
  if (!target) return;

  if (skills.length === 0) {
    target.innerHTML = `<div class="empty">No public skills yet.</div>`;
    return;
  }

  target.innerHTML = skills.map(skill => `
    <div class="pill">
      ${escapeHTML(clean(skill.Skill_Name))}
      <span> ${escapeHTML(clean(skill.Level))}</span>
    </div>
  `).join("");
}

function renderAchievements(items) {
  const target = document.getElementById("achievementList");
  if (!target) return;

  if (items.length === 0) {
    target.innerHTML = `<div class="empty">No public achievements yet.</div>`;
    return;
  }

  target.innerHTML = items.map(item => `
    <div class="timeline-item">
      <strong>${escapeHTML(clean(item.Title))}</strong>
      <span>${escapeHTML(clean(item.Year))} • ${escapeHTML(clean(item.Organization))} • ${escapeHTML(clean(item.Result))}</span>
      <p>${escapeHTML(clean(item.Description))}</p>
      ${linkButton(item.Evidence_URL, "Evidence")}
    </div>
  `).join("");
}

function renderCertificates(items) {
  const target = document.getElementById("certificateList");
  if (!target) return;

  if (items.length === 0) {
    target.innerHTML = `<div class="empty">No public certificates yet.</div>`;
    return;
  }

  target.innerHTML = items.map(item => `
    <div class="list-item">
      <strong>${escapeHTML(clean(item.Certificate_Name))}</strong>
      <span>${escapeHTML(clean(item.Year))} • ${escapeHTML(clean(item.Issuer))} • ${escapeHTML(clean(item.Category))}</span>
      <p>${escapeHTML(clean(item.Public_Description))}</p>
      ${linkButton(item.Certificate_URL, "View")}
    </div>
  `).join("");
}

function renderMedia(items) {
  const target = document.getElementById("mediaGrid");
  if (!target) return;

  if (items.length === 0) {
    target.innerHTML = `<div class="empty">No public media yet.</div>`;
    return;
  }

  target.innerHTML = items.map(item => {
    const title = clean(item.Title) || "Media";
    const thumb = clean(item.Thumbnail_URL) || clean(item.Media_URL) || DEFAULT_IMAGE;
    return `
      <article class="card">
        ${renderImage(thumb, title)}
        <div class="card-body">
          <span class="tag">${escapeHTML(clean(item.Media_Type) || "Media")} • ${escapeHTML(clean(item.Year))}</span>
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(clean(item.Caption))}</p>
          ${linkButton(item.Media_URL, "Open")}
        </div>
      </article>`;
  }).join("");
}

function linkButton(url, label) {
  const cleanUrl = clean(url);
  if (!cleanUrl) return "";
  return `<a class="small-link" href="${escapeAttr(cleanUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
}

function renderImage(url, title) {
  const cleanUrl = clean(url) || DEFAULT_IMAGE;
  return `<img class="card-image" src="${escapeAttr(cleanUrl)}" alt="${escapeAttr(title)}" loading="lazy" data-fallback="${escapeAttr(DEFAULT_IMAGE)}">`;
}

function orderSort(a, b) {
  const ao = Number(clean(a.Highlight_Order) || 999);
  const bo = Number(clean(b.Highlight_Order) || 999);
  return ao - bo || yearSort(a, b);
}

function yearSort(a, b) {
  return Number(clean(b.Year) || 0) - Number(clean(a.Year) || 0);
}

function clean(value) {
  return String(value ?? "").trim();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showGlobalError(message) {
  ["projectGrid", "skillsList", "achievementList", "certificateList", "mediaGrid"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="error">${escapeHTML(message)}</div>`;
  });
}

function escapeHTML(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}
