
import type { EditorDocument, EditorRow, EditorColumn, EditorBlockData, BlockStyles, ButtonBlockData, DocumentSettings, ConditionalLayoutBlockData, ImageBlockData, ImageElementStyles } from './types';

function formatStyles(styles?: BlockStyles): string {
  if (!styles) return '';
  let styleString = '';
  if (styles.backgroundColor) styleString += `background-color:${styles.backgroundColor};`;
  if (styles.padding) styleString += `padding:${styles.padding};`;
  if (styles.margin) styleString += `margin:${styles.margin};`;
  if (styles.border) styleString += `border:${styles.border};`;
  if (styles.borderRadius) styleString += `border-radius:${styles.borderRadius};`;
  return styleString;
}

function formatImageElementStyles(styles?: ImageElementStyles): string {
  if (!styles) return '';
  let styleString = '';
  if (styles.border) styleString += `border:${styles.border};`;
  if (styles.borderRadius) styleString += `border-radius:${styles.borderRadius};`;
  return styleString;
}


function blockToHtml(block: EditorBlockData, documentSettings?: DocumentSettings): string {
  const containerStylesString = formatStyles(block.styles);
  const globalFontFamily = documentSettings?.fontFamily || "'PT Sans', sans-serif";
  const defaultTextColor = '#333333'; 

  switch (block.type) {
    case 'text':
      let textContent = block.content.replace(/\{\{([^}]+)\}\}/g, (_, field) => `{{${field.trim()}}}`);
      return `
        <tr>
          <td style="width:100%; ${containerStylesString}">
            <div style="font-family: ${globalFontFamily}; font-size: 14px; line-height: 1.6; color: ${defaultTextColor};">
              ${textContent}
            </div>
          </td>
        </tr>`;

    case 'image':
      const imageBlock = block as ImageBlockData;
      const imageAlign = imageBlock.align || 'center';
      let imageWrapperStyles = `font-size:0px; line-height:0px; width:100%; text-align:${imageAlign}; ${containerStylesString}`;
      const imageElementStylesString = formatImageElementStyles(imageBlock.imageElementStyles);
      
      const imgTag = `<img src="${imageBlock.src}" alt="${imageBlock.alt}" style="max-width:100%; height:auto; display:inline-block; ${imageElementStylesString}" data-ai-hint="placeholder image content" />`;

      return `
        <tr>
          <td style="${imageWrapperStyles}">
            ${imageBlock.linkHref ? `<a href="${imageBlock.linkHref}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:inline-block;">${imgTag}</a>` : imgTag}
          </td>
        </tr>`;

    case 'button':
      const buttonBlock = block as ButtonBlockData;
      const buttonSpecificStyles = buttonBlock.buttonStyles || {};
      
      let buttonFont = documentSettings?.fontFamily ? documentSettings.fontFamily.split(',')[0].trim() : "'Poppins'";
      if (buttonFont.startsWith("'") || buttonFont.startsWith('"')) {
        // Keep quotes if present
      } else {
        buttonFont = `'${buttonFont}'`; // Add quotes if not present
      }
      const buttonFontFamilyString = `${buttonFont}, sans-serif`;

      let buttonElementStyles = `font-family:${buttonFontFamilyString}; display:inline-block; text-decoration:none; text-transform:none;`;
      buttonElementStyles += `color:${buttonSpecificStyles.color || '#ffffff'};`;
      buttonElementStyles += `font-size:${buttonSpecificStyles.fontSize || '16px'};`;
      buttonElementStyles += `font-weight:${buttonSpecificStyles.fontWeight || 'bold'};`;
      buttonElementStyles += `line-height:120%;`;
      buttonElementStyles += `margin:0;`;
      if (buttonSpecificStyles.padding) buttonElementStyles += `padding:${buttonSpecificStyles.padding};`; else buttonElementStyles += `padding:10px 25px;`;
      if (buttonSpecificStyles.borderRadius) buttonElementStyles += `border-radius:${buttonSpecificStyles.borderRadius};`;
      if (buttonSpecificStyles.border) buttonElementStyles += `border:${buttonSpecificStyles.border};`;


      const imageHtml = (imgUrl?: string, imgPos?: 'left' | 'right' | 'none') => {
        if (!imgUrl || imgPos === 'none') return '';
        const marginRight = imgPos === 'left' ? '8px' : '0';
        const marginLeft = imgPos === 'right' ? '8px' : '0';
        return `<img src="${imgUrl}" alt="" width="16" height="16" style="vertical-align: middle; margin-right: ${marginRight}; margin-left: ${marginLeft}; display: inline-block; max-height: 1.2em; border:0;" data-ai-hint="button icon">`;
      };
      
      let buttonCellStyle = `vertical-align:middle;`;
      if (buttonSpecificStyles.backgroundColor) buttonCellStyle += `background-color:${buttonSpecificStyles.backgroundColor};`; else buttonCellStyle += `background-color:#64B5F6;`;
      if (buttonSpecificStyles.borderRadius) buttonCellStyle += `border-radius:${buttonSpecificStyles.borderRadius};`; // Apply border-radius to TD for Outlook

      return `
        <tr>
          <td align="${buttonBlock.align || 'center'}" style="width:100%; ${containerStylesString}">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate; mso-table-lspace:0pt; mso-table-rspace:0pt; width:auto; line-height:100%;">
              <tr>
                <td align="center" role="presentation" style="${buttonCellStyle}">
                  <a href="${buttonBlock.href || '#'}" target="_blank" style="${buttonElementStyles}">
                    ${imageHtml(buttonBlock.imageUrl, buttonBlock.imagePosition === 'left' ? 'left' : undefined)}
                    <span>${buttonBlock.text || 'Button Text'}</span>
                    ${imageHtml(buttonBlock.imageUrl, buttonBlock.imagePosition === 'right' ? 'right' : undefined)}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;    case 'heading':
      const headingBlock = block as import('./types').HeadingBlockData;
      const headingAlign = headingBlock.align || 'left';
      let headingContent = headingBlock.content.replace(/\{\{([^}]+)\}\}/g, (_, field) => `{{${field.trim()}}}`);
      const headingTag = `h${headingBlock.level}`;
      
      // Set explicit font sizes for better email client compatibility
      const headingFontSizes = {
        1: '32px',
        2: '28px', 
        3: '24px',
        4: '20px',
        5: '18px',
        6: '16px'
      };
      const fontSize = headingFontSizes[headingBlock.level as keyof typeof headingFontSizes] || '24px';
      
      return `
        <tr>
          <td style="width:100%; text-align:${headingAlign}; ${containerStylesString}">
            <${headingTag} style="font-family: ${globalFontFamily}; font-size: ${fontSize}; line-height: 1.2; margin: 0; padding: 0; color: ${defaultTextColor}; font-weight: bold; display: block;">
              ${headingContent}
            </${headingTag}>
          </td>
        </tr>`;

    case 'divider':
      const dividerBlock = block as import('./types').DividerBlockData;
      const dividerAlign = dividerBlock.align || 'center';
      const dividerThickness = dividerBlock.thickness || '1px';
      const dividerColor = dividerBlock.color || '#cccccc';
      const dividerStyle = dividerBlock.style || 'solid';
      const dividerWidth = dividerBlock.width || '100%';
      
      return `
        <tr>
          <td style="width:100%; text-align:${dividerAlign}; ${containerStylesString}">
            <hr style="border: 0; border-top: ${dividerThickness} ${dividerStyle} ${dividerColor}; width: ${dividerWidth}; margin: 10px auto;" />
          </td>
        </tr>`;

    case 'spacer':
      const spacerBlock = block as import('./types').SpacerBlockData;
      const spacerHeight = spacerBlock.height || '20px';
      
      return `
        <tr>
          <td style="width:100%; height:${spacerHeight}; line-height:${spacerHeight}; font-size:0; ${containerStylesString}">
            &nbsp;
          </td>
        </tr>`;

    case 'html':
      const htmlBlock = block as import('./types').HtmlBlockData;
      
      return `
        <tr>
          <td style="width:100%; ${containerStylesString}">
            ${htmlBlock.content}
          </td>
        </tr>`;

    case 'conditionalLayout':
      const conditionalBlock = block as ConditionalLayoutBlockData;
      const innerContentHtml = conditionalBlock.rows.map(row => rowToHtml(row, documentSettings, true)).join('');
      const liquidCondition = conditionalBlock.condition || 'true'; 

      return `
        <tr>
          <td style="${containerStylesString}">
            {% if ${liquidCondition} %}
              ${innerContentHtml}
            {% endif %}
          </td>
        </tr>
      `;
    default:
      return '<tr><td><!-- Unknown block type --></td></tr>';
  }
}

function columnToHtml(column: EditorColumn, target: 'mso' | 'standard', documentSettings?: DocumentSettings, isNestedInConditional: boolean = false): string {
  const widthPercentage = (column.span / 12) * 100;
  const contentWidthPx = parseInt(documentSettings?.contentWidth || "600px", 10);
  const approxPixelWidth = Math.floor(contentWidthPx * (column.span / 12));

  const blocksHtml = column.blocks.map(block => blockToHtml(block, documentSettings)).join('');
  
  const innerTableForBlocks = `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; vertical-align:top;">
      <tbody>
        ${blocksHtml}
      </tbody>
    </table>`;

  if (target === 'mso' && !isNestedInConditional) {
    return `
      <td style="vertical-align:top;width:${approxPixelWidth}px;padding:0;">
        ${innerTableForBlocks}
      </td>
    `;
  } else { 
    // Use standard rendering for non-MSO targets or if nested in conditional
    return `
      <td align="left" style="font-size:0px; padding:0; word-break:break-word; vertical-align:top;" width="${widthPercentage}%">
        ${innerTableForBlocks}
      </td>
    `;
  }
}

function rowToHtml(row: EditorRow, documentSettings?: DocumentSettings, isNestedInConditional: boolean = false): string {
  const contentWidth = documentSettings?.contentWidth || '600px';

  if (isNestedInConditional) {
    // Simplified rendering for rows inside a conditional block
    const columnsContent = row.columns.map(col => columnToHtml(col, 'standard', documentSettings, true)).join('');
    return `
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0;text-align:center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr>
                  ${columnsContent}
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    // Existing MSO/standard split logic for top-level rows
    const columnsContentForMso = row.columns.map(col => columnToHtml(col, 'mso', documentSettings, false)).join('');
    const columnsContentForStandard = row.columns.map(col => columnToHtml(col, 'standard', documentSettings, false)).join('');

    return `
      <!--[if mso | IE]>
      <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:${contentWidth};" width="${parseInt(contentWidth, 10)}">
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
      <div style="margin:0px auto;max-width:${contentWidth};">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:0;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      ${columnsContentForMso}
                    </tr>
                  </table>
                <![endif]-->
                <!--[if !mso]><!-->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
                  <tr>
                    ${columnsContentForStandard}
                  </tr>
                </table>
                <!--<![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    `;
  }
}

function getGoogleFontLinkTag(fontFamilyString?: string): string {
  if (!fontFamilyString) return '';

  const firstFont = fontFamilyString.split(',')[0].replace(/['"]/g, '').trim();
  if (!firstFont) return '';

  const systemFonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 
    'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Comic Sans MS', 'Trebuchet MS', 'Impact', 'Tahoma'
  ];
  if (systemFonts.some(sf => firstFont.toLowerCase() === sf.toLowerCase())) {
    return ''; 
  }
  
  const fontNameForUrl = firstFont.replace(/\s+/g, '+');
  const weights = '400,700'; 
  
  return `<link href="https://fonts.googleapis.com/css2?family=${fontNameForUrl}:wght@${weights}&display=swap" rel="stylesheet" type="text/css">`;
}

export function exportDocumentAsHtml(document: EditorDocument): string {
  const { settings } = document;
  const bodyContent = document.rows.map(row => rowToHtml(row, settings, false)).join(''); // Initial call with isNestedInConditional = false
  const bodyBackgroundColor = settings?.backgroundColor || '#F0F4F8';
  const globalFontFamily = settings?.fontFamily || "'PT Sans', sans-serif";
  const googleFontLinkTag = getGoogleFontLinkTag(settings?.fontFamily);

  const cssReset = `
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
  `;

  return `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <title>Your Email Title</title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${googleFontLinkTag}
        <style type="text/css">
          ${cssReset}
          #outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; font-family: ${globalFontFamily}; background-color: ${bodyBackgroundColor}; line-height: 1.6; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; font-family: ${globalFontFamily}; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; display: block; }
          p { display:block; margin: 0 0 10px 0; font-family: ${globalFontFamily}; }
          strong, b { font-weight: bold !important; } 
          em, i { font-style: italic !important; } 
          a span { color: inherit !important; text-decoration: none !important; }
        </style>
        <!--[if mso]>
        <noscript>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        </noscript>
        <![endif]-->
        <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
      </head>
      <body style="word-spacing:normal;background-color:${bodyBackgroundColor};" bgcolor="${bodyBackgroundColor}">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; background-color:${bodyBackgroundColor};">
            <tr>
                <td>
                    ${bodyContent}
                </td>
            </tr>
        </table>
      </body>
    </html>
  `;
}

export function exportDocumentAsJson(document: EditorDocument): EditorDocument {
  return JSON.parse(JSON.stringify(document)); 
}


    