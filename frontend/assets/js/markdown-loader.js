/**
 * MARKDOWN LOADER & PARSER CHO PORTFOLIO CONTENT MARKETING
 * Tự động phân tích Frontmatter (YAML) và Render Markdown sang HTML
 */

const MarkdownLoader = {
  /**
   * Phân tích một chuỗi markdown có Frontmatter
   */
  parseFrontmatter(rawText, fallbackId = '') {
    const pattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = rawText.match(pattern);

    let metadata = {};
    let markdownContent = rawText;

    if (match) {
      const yamlBlock = match[1];
      markdownContent = match[2];
      metadata = this.parseSimpleYaml(yamlBlock);
    }

    if (!metadata.id) {
      metadata.id = fallbackId;
    }

    return {
      metadata,
      content: markdownContent.trim()
    };
  },

  /**
   * Parser YAML đơn giản hỗ trợ các kiểu dữ liệu thường dùng trong Frontmatter
   */
  parseSimpleYaml(yamlText) {
    const data = {};
    const lines = yamlText.split(/\r?\n/);
    let currentKey = null;
    let listItems = [];
    let currentListItemObj = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) continue;

      // Xử lý danh sách cấp 1 (- "item" hoặc - item)
      if (line.match(/^\s*-\s+/)) {
        const itemContent = line.replace(/^\s*-\s+/, '').trim();
        
        // Nếu là object trong mảng (vd: - label: "Traffic", value: "+150%")
        if (itemContent.includes(':')) {
          const colonIdx = itemContent.indexOf(':');
          const k = itemContent.substring(0, colonIdx).trim();
          const v = this.cleanValue(itemContent.substring(colonIdx + 1));
          currentListItemObj = { [k]: v };
          listItems.push(currentListItemObj);
        } else {
          listItems.push(this.cleanValue(itemContent));
        }
        continue;
      }

      // Xử lý thuộc tính lồng nhau của item mảng
      if (currentListItemObj && line.match(/^\s{4,}[a-zA-Z0-9_]+:/)) {
        const colonIdx = trimmed.indexOf(':');
        const k = trimmed.substring(0, colonIdx).trim();
        const v = this.cleanValue(trimmed.substring(colonIdx + 1));
        currentListItemObj[k] = v;
        continue;
      }

      // Xử lý key: value thông thường
      const colonIdx = line.indexOf(':');
      if (colonIdx > -1) {
        if (currentKey && listItems.length > 0) {
          data[currentKey] = listItems;
          listItems = [];
          currentListItemObj = null;
        }

        const key = line.substring(0, colonIdx).trim();
        const rawVal = line.substring(colonIdx + 1).trim();

        currentKey = key;

        if (rawVal === '') {
          listItems = [];
          currentListItemObj = null;
        } else {
          data[key] = this.cleanValue(rawVal);
          currentKey = null;
        }
      }
    }

    if (currentKey && listItems.length > 0) {
      data[currentKey] = listItems;
    }

    return data;
  },

  cleanValue(val) {
    let clean = val.trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1);
    }
    if (clean.toLowerCase() === 'true') return true;
    if (clean.toLowerCase() === 'false') return false;
    if (!isNaN(clean) && clean !== '') return Number(clean);
    return clean;
  },

  /**
   * Tải 1 file Markdown và trả về metadata + HTML
   */
  async loadProjectFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Không thể tải file: ${filePath} (Mã lỗi ${response.status})`);
      }
      const rawText = await response.text();
      
      const fileName = filePath.split('/').pop().replace(/\.md$/, '');
      const parsed = this.parseFrontmatter(rawText, fileName);

      return {
        ...parsed.metadata,
        id: parsed.metadata.id || fileName,
        filePath,
        markdownContent: parsed.content,
        htmlContent: typeof marked !== 'undefined' ? marked.parse(parsed.content) : parsed.content
      };
    } catch (err) {
      console.error(`Lỗi đọc file markdown: ${filePath}`, err);
      return null;
    }
  },

  /**
   * Tải toàn bộ danh sách dự án được khai báo trong window.PROJECTS_MANIFEST
   */
  async loadAllProjects() {
    if (!window.PROJECTS_MANIFEST || !Array.isArray(window.PROJECTS_MANIFEST)) {
      console.warn("Chưa tìm thấy PROJECTS_MANIFEST trong window");
      return [];
    }

    const promises = window.PROJECTS_MANIFEST.map(path => this.loadProjectFile(path));
    const results = await Promise.all(promises);
    return results.filter(p => p !== null);
  },

  /**
   * Lấy chi tiết 1 dự án theo ID slug
   */
  async getProjectById(id) {
    const all = await this.loadAllProjects();
    return all.find(p => p.id === id) || null;
  }
};

window.MarkdownLoader = MarkdownLoader;
