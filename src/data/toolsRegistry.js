export const TOOLS_REGISTRY = [
  // 1. IMAGE COMPRESSOR
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    icon: 'Maximize2',
    popular: true,
    isPro: false,
    shortDescription: 'Compress JPG, PNG & WebP images up to 90% without visible quality loss.',
    seo: {
      title: 'Free Online Image Compressor - Reduce Image File Size Fast',
      description: 'Compress images online for free. Reduce file size of JPG, PNG, WebP images instantly in browser with high quality output.',
      keywords: 'image compressor, compress image, reduce image size, shrink photo, jpg compressor'
    },
    howToUse: [
      'Upload or drag & drop your image file (JPG, PNG, WebP).',
      'Adjust the target quality slider to your desired compression level.',
      'Preview side-by-side original and compressed images with instant file size comparison.',
      'Click "Download Compressed Image" to save your optimized file.'
    ],
    features: [
      '100% Client-side processing — no server uploads',
      'Supports JPG, PNG, and WebP formats',
      'Live original vs compressed side-by-side preview'
    ],
    faqs: []
  },

  // 2. PDF MERGER
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    icon: 'Files',
    popular: true,
    isPro: false,
    shortDescription: 'Combine multiple PDF files into one single organized PDF document.',
    seo: {
      title: 'Free PDF Merger - Combine Multiple PDF Files Online',
      description: 'Merge multiple PDF documents into a single PDF file online for free.',
      keywords: 'pdf merger, combine pdf, merge pdf online'
    },
    howToUse: ['Upload PDF files.', 'Reorder cards.', 'Click Merge PDFs.'],
    features: ['Combine unlimited PDFs', 'Drag & drop reordering'],
    faqs: []
  },

  // 3. PDF TO IMAGE
  {
    id: 'pdf-to-image',
    slug: 'pdf-to-image',
    name: 'PDF to Image Converter',
    category: 'pdf',
    icon: 'FileImage',
    popular: true,
    isPro: false,
    shortDescription: 'Convert PDF document pages into high-resolution PNG or JPG images.',
    seo: {
      title: 'Free PDF to Image Converter',
      description: 'Convert PDF pages to PNG or JPG images online for free.',
      keywords: 'pdf to image, pdf to png'
    },
    howToUse: ['Select PDF file.', 'Choose PNG/JPG.', 'Download images.'],
    features: ['High DPI rendering', 'Download individual or Zipped'],
    faqs: []
  },

  // 4. QR GENERATOR
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    name: 'QR Code Generator',
    category: 'security',
    icon: 'QrCode',
    popular: true,
    isPro: false,
    shortDescription: 'Generate custom QR codes for URLs, WiFi networks, text, and email.',
    seo: {
      title: 'Free QR Code Generator',
      description: 'Create customized QR codes for websites and WiFi.',
      keywords: 'qr generator, custom qr code'
    },
    howToUse: ['Enter URL or text.', 'Customize colors.', 'Download PNG/SVG.'],
    features: ['Custom colors', 'PNG & SVG export'],
    faqs: []
  },

  // 5. PASSWORD GENERATOR
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'security',
    icon: 'KeyRound',
    popular: true,
    isPro: false,
    shortDescription: 'Generate secure, randomized passwords with customizable length and strength meter.',
    seo: {
      title: 'Free Secure Password Generator',
      description: 'Generate strong random passwords.',
      keywords: 'password generator, strong password'
    },
    howToUse: ['Set length.', 'Toggle character types.', 'Copy password.'],
    features: ['Cryptographically secure', 'Strength meter'],
    faqs: []
  },

  // 6. WORD COUNTER
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text',
    icon: 'FileSpreadsheet',
    popular: true,
    isPro: false,
    shortDescription: 'Count words, characters, sentences, paragraphs, and reading time.',
    seo: {
      title: 'Free Online Word Counter',
      description: 'Accurate word and character count tool.',
      keywords: 'word counter, count words'
    },
    howToUse: ['Paste text.', 'View real-time stats.'],
    features: ['Reading time duration', 'Top word frequency'],
    faqs: []
  },

  // 7. JSON FORMATTER
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'dev',
    icon: 'Braces',
    popular: true,
    isPro: false,
    shortDescription: 'Prettify, validate, minify, and inspect JSON data structures.',
    seo: {
      title: 'Free JSON Formatter & Validator',
      description: 'Format and validate JSON syntax online.',
      keywords: 'json formatter, json beautify'
    },
    howToUse: ['Paste JSON.', 'Click Format or Minify.'],
    features: ['Syntax error locator', 'Prettify & Minify'],
    faqs: []
  },

  // 8. IMAGE RESIZER
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    icon: 'Scaling',
    popular: true,
    isPro: false,
    shortDescription: 'Resize image dimensions by custom width, height, or aspect ratio.',
    seo: {
      title: 'Free Image Resizer',
      description: 'Resize image file dimensions easily.',
      keywords: 'image resizer, change dimensions'
    },
    howToUse: ['Upload photo.', 'Set dimensions.', 'Download.'],
    features: ['Aspect ratio lock', 'Scale percentage presets'],
    faqs: []
  },

  // 9. BACKGROUND REMOVER
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    category: 'image',
    icon: 'Wand2',
    popular: true,
    isPro: false,
    shortDescription: 'Isolate backdrop colors and export transparent PNG files.',
    seo: {
      title: 'Free Image Background Remover',
      description: 'Remove background from images for free.',
      keywords: 'background remover, transparent png'
    },
    howToUse: ['Upload photo.', 'Pick background color.', 'Download PNG.'],
    features: ['Color picker isolation', 'Transparent PNG export'],
    faqs: []
  },

  // 10. TEXT CONVERTER
  {
    id: 'text-converter',
    slug: 'text-converter',
    name: 'Text Case Converter',
    category: 'text',
    icon: 'CaseSensitive',
    popular: true,
    isPro: false,
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, kebab-case.',
    seo: {
      title: 'Free Text Case Converter',
      description: 'Convert text case online.',
      keywords: 'text converter, case converter'
    },
    howToUse: ['Paste text.', 'Click case button.', 'Copy output.'],
    features: ['UPPER, lower, Title, camelCase', '1-click copy'],
    faqs: []
  },

  // 11. UNIT CONVERTER
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'All-in-One Unit Converter',
    category: 'converter',
    icon: 'ArrowLeftRight',
    popular: true,
    isPro: false,
    shortDescription: 'Convert units for Length, Mass, Temperature, Storage, and Speed.',
    seo: {
      title: 'Free All-in-One Unit Converter',
      description: 'Convert physical units fast.',
      keywords: 'unit converter, length, weight'
    },
    howToUse: ['Select unit category.', 'Enter value.', 'Instant output.'],
    features: ['Supports 5+ categories', 'Bi-directional'],
    faqs: []
  },

  // 12. CALCULATOR
  {
    id: 'calculator',
    slug: 'calculator',
    name: 'Scientific & Standard Calculator',
    category: 'calculator',
    icon: 'Calculator',
    popular: true,
    isPro: false,
    shortDescription: 'Scientific calculator with trigonometric, logarithmic, and power functions.',
    seo: {
      title: 'Free Online Scientific Calculator',
      description: 'Scientific calculator online.',
      keywords: 'scientific calculator, math'
    },
    howToUse: ['Enter equation.', 'Press = to solve.'],
    features: ['Keyboard shortcut support', 'History ribbon'],
    faqs: []
  },

  // 13. POMODORO TIMER
  {
    id: 'pomodoro-timer',
    slug: 'pomodoro-timer',
    name: 'Pomodoro Study & Focus Timer',
    category: 'calculator',
    icon: 'Timer',
    popular: true,
    isPro: false,
    shortDescription: 'Boost study & work productivity with 25-minute focus sessions and break alerts.',
    seo: {
      title: 'Free Pomodoro Focus Timer - Boost Study Productivity',
      description: 'Online Pomodoro timer with 25m work sessions and break alerts.',
      keywords: 'pomodoro timer, study timer, focus timer'
    },
    howToUse: ['Select Work or Break mode.', 'Click Start Focus.', 'Listen for completion alert!'],
    features: ['25m work & 5m break presets', 'Session completion counter', 'Circular progress visualization'],
    faqs: []
  },

  // 14. GPA CALCULATOR
  {
    id: 'gpa-calculator',
    slug: 'gpa-calculator',
    name: 'GPA & CGPA Grade Calculator',
    category: 'calculator',
    icon: 'Landmark',
    popular: true,
    isPro: false,
    shortDescription: 'Calculate college & high school GPA, total credit hours, and percentage estimate.',
    seo: {
      title: 'Free GPA Calculator - Calculate Grade Point Average',
      description: 'Calculate semester GPA and CGPA online for free.',
      keywords: 'gpa calculator, cgpa calculator, grade point'
    },
    howToUse: ['Add your course titles & credit hours.', 'Select grade for each course.', 'View live GPA score!'],
    features: ['4.0 letter grade scale', 'Percentage conversion estimate', 'Add/remove course rows'],
    faqs: []
  },

  // 15. PROFIT MARGIN CALCULATOR
  {
    id: 'profit-margin-calculator',
    slug: 'profit-margin-calculator',
    name: 'Profit Margin & Markup Calculator',
    category: 'calculator',
    icon: 'Percent',
    popular: true,
    isPro: false,
    shortDescription: 'Calculate gross profit dollar amount, profit margin percentage, and markup percentage.',
    seo: {
      title: 'Free Profit Margin Calculator - Calculate Gross Profit %',
      description: 'Calculate profit margin and markup percentage for retail & products.',
      keywords: 'profit margin calculator, markup calculator'
    },
    howToUse: ['Enter Cost Price (CP).', 'Enter Selling Price (SP).', 'View Margin % & Markup %.'],
    features: ['Instant margin % & markup % calculation', 'Gross profit dollar output'],
    faqs: []
  },

  // 16. INVOICE GENERATOR
  {
    id: 'invoice-generator',
    slug: 'invoice-generator',
    name: 'Invoice & Bill Receipt Generator',
    category: 'dev',
    icon: 'FileText',
    popular: true,
    isPro: false,
    shortDescription: 'Create custom business invoices & bill receipts with itemized pricing and instant PDF download.',
    seo: {
      title: 'Free Invoice & Bill Receipt Generator - Create PDF Invoices',
      description: 'Generate professional PDF invoices for clients, business, and billing for free.',
      keywords: 'invoice generator, bill builder, pdf invoice'
    },
    howToUse: ['Fill business & client details.', 'Add line items, rates, and tax %.', 'Click Print/Download PDF Invoice.'],
    features: ['Itemized rows & auto calculations', 'Tax / GST rate calculations', 'Instant PDF print & export'],
    faqs: []
  },

  // 17. IMAGE WATERMARK GENERATOR
  {
    id: 'image-watermark',
    slug: 'image-watermark',
    name: 'Image Watermark & Photo Stamp',
    category: 'image',
    icon: 'Wand2',
    popular: true,
    isPro: false,
    shortDescription: 'Add text watermarks to photos with custom font size, opacity, colors, and positioning.',
    seo: {
      title: 'Free Image Watermark Tool - Add Text Watermark Online',
      description: 'Add text watermarks and copyright stamps to your photos online for free.',
      keywords: 'image watermark, watermark photos, photo stamp'
    },
    howToUse: ['Upload photo.', 'Enter watermark text.', 'Adjust opacity & font size.', 'Download PNG!'],
    features: ['100% Client-side privacy', 'Custom font size & opacity', 'High resolution PNG download'],
    faqs: []
  },

  // 18. UNIT PRICE COMPARATOR
  {
    id: 'unit-price-calculator',
    slug: 'unit-price-calculator',
    name: 'Unit Price & Grocery Deal Comparator',
    category: 'calculator',
    icon: 'Tag',
    popular: true,
    isPro: false,
    shortDescription: 'Compare pack size A vs pack size B to find the cheapest deal per gram, ml, or unit.',
    seo: {
      title: 'Free Unit Price Comparator - Find Cheapest Grocery Deal',
      description: 'Compare product price per unit to find the best deal at the store.',
      keywords: 'unit price calculator, deal comparator, grocery savings'
    },
    howToUse: ['Select unit (grams, ml, pcs).', 'Enter Price & Quantity for Option A and B.', 'See which pack saves money!'],
    features: ['Per-unit cost comparison', 'Percentage savings calculation'],
    faqs: []
  },

  // 19. BASE64 ENCODER & DECODER
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder & Decoder',
    category: 'dev',
    icon: 'Code',
    isPro: false,
    shortDescription: 'Encode plain text or data into Base64 format and decode Base64 strings.'
  },

  // 20. URL ENCODER & DECODER
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    category: 'dev',
    icon: 'Link',
    isPro: false,
    shortDescription: 'Encode special characters for URL query strings or decode percent-encoded URLs.'
  },

  // 21. UUID / GUID GENERATOR
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    category: 'security',
    icon: 'Fingerprint',
    isPro: false,
    shortDescription: 'Generate cryptographically random UUID v4 / GUID strings individually or in bulk.'
  },

  // 22. IMAGE TO BASE64
  {
    id: 'image-to-base64',
    slug: 'image-to-base64',
    name: 'Image to Base64 Converter',
    category: 'image',
    icon: 'Binary',
    isPro: false,
    shortDescription: 'Convert image files into Base64 data URIs for embedding directly into HTML or CSS.'
  },

  // 23. CODE MINIFIER
  {
    id: 'code-minifier',
    slug: 'code-minifier',
    name: 'CSS & HTML Code Minifier',
    category: 'dev',
    icon: 'FileCode',
    isPro: false,
    shortDescription: 'Minify CSS and HTML source code to strip whitespace and decrease web page load time.'
  },

  // 24. DIFF CHECKER
  {
    id: 'diff-checker',
    slug: 'diff-checker',
    name: 'Text & Code Diff Checker',
    category: 'dev',
    icon: 'GitCompare',
    isPro: false,
    shortDescription: 'Compare two text files or code snippets side-by-side to highlight additions and deletions.'
  },

  // 25. HASH GENERATOR
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator (MD5, SHA-256)',
    category: 'security',
    icon: 'Lock',
    isPro: false,
    shortDescription: 'Generate cryptographic hash checksums (SHA-256, SHA-512, SHA-1, MD5) for text.'
  },

  // 26. MARKDOWN EDITOR
  {
    id: 'markdown-editor',
    slug: 'markdown-editor',
    name: 'Markdown Live Editor',
    category: 'text',
    icon: 'FileEdit',
    isPro: false,
    shortDescription: 'Write Markdown text with side-by-side formatted HTML preview and export to `.md` file.'
  },

  // 27. FAVICON GENERATOR
  {
    id: 'favicon-generator',
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    category: 'image',
    icon: 'AppWindow',
    isPro: false,
    shortDescription: 'Create multi-resolution favicon `.ico` and PNG icons for website browser tabs.'
  },

  // 28. EMI CALCULATOR
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    name: 'Loan & Home EMI Calculator',
    category: 'calculator',
    icon: 'Landmark',
    isPro: false,
    shortDescription: 'Calculate monthly loan EMI payments, total interest payable, and amortization timeline.'
  },

  // 29. PERCENTAGE CALCULATOR
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculator',
    icon: 'Percent',
    isPro: false,
    shortDescription: 'Calculate percentage of numbers, percentage change, percentage increase/decrease.'
  },

  // 30. PX TO REM
  {
    id: 'px-to-rem',
    slug: 'px-to-rem',
    name: 'PX to REM & EM Converter',
    category: 'converter',
    icon: 'Ruler',
    isPro: false,
    shortDescription: 'Convert CSS Pixels (px) to REM/EM relative units based on base font size.'
  },

  // 31. COLOR CODE CONVERTER
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Code Converter (HEX, RGB, HSL)',
    category: 'converter',
    icon: 'Pipette',
    isPro: false,
    shortDescription: 'Convert color codes seamlessly between HEX, RGB, HSL, and HSV formats.'
  },

  // 32. SEO META TAG GENERATOR
  {
    id: 'meta-tag-generator',
    slug: 'meta-tag-generator',
    name: 'SEO Meta Tag Generator',
    category: 'social',
    icon: 'Globe',
    isPro: false,
    shortDescription: 'Generate SEO Meta Title, Description, Open Graph, and Twitter Card HTML tags.'
  },

  // 33. OPEN GRAPH PREVIEWER
  {
    id: 'open-graph-previewer',
    slug: 'open-graph-previewer',
    name: 'Open Graph & Social Previewer',
    category: 'social',
    icon: 'Eye',
    isPro: false,
    shortDescription: 'Preview how your website link will appear when shared on Facebook, Twitter/X, and LinkedIn.'
  },

  // 34. BARCODE GENERATOR
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    name: 'Barcode Generator',
    category: 'security',
    icon: 'Scan',
    isPro: false,
    shortDescription: 'Generate custom barcodes (CODE128, EAN-13, UPC, CODE39) and download as PNG/SVG.'
  },

  // 35. JWT DECODER
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Token Decoder',
    category: 'dev',
    icon: 'ShieldAlert',
    isPro: false,
    shortDescription: 'Decode JSON Web Tokens (JWT) payload, header, algorithm, and expiration timestamp.'
  },

  // 36. AGE CALCULATOR
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator & Birthday Countdown',
    category: 'calculator',
    icon: 'Calendar',
    isPro: false,
    shortDescription: 'Calculate exact age in Years, Months, Days, Hours, Minutes, and time until next birthday.'
  },

  // 37. REGEX TESTER
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regular Expression (Regex) Tester',
    category: 'dev',
    icon: 'TextSearch',
    isPro: false,
    shortDescription: 'Test regular expression patterns against sample text with live match highlighting.'
  },

  // 38. DISCOUNT CALCULATOR
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sales Tax Calculator',
    category: 'calculator',
    icon: 'Tag',
    isPro: false,
    shortDescription: 'Calculate final price after discount percentage, sales tax, and total savings.'
  },

  // 39. ZIP / UNZIP
  {
    id: 'zip-tool',
    slug: 'zip-tool',
    name: 'ZIP / UnZIP Archive Utility',
    category: 'dev',
    icon: 'FolderArchive',
    popular: true,
    isPro: false,
    shortDescription: 'Create compressed .ZIP archives or extract files from ZIP in browser with zero server uploads.',
    seo: {
      title: 'Free ZIP and UnZIP Tool Online - Create & Extract ZIP Files',
      description: 'Create and extract ZIP archives online for free without uploading files to any server.',
      keywords: 'zip tool, unzip online, extract zip, zip creator, zip compressor'
    }
  },

  // 40. PDF COMPRESSOR
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    icon: 'FileDown',
    popular: true,
    isPro: false,
    shortDescription: 'Reduce PDF file size with adjustable compression levels while maintaining document clarity.',
    seo: {
      title: 'Free PDF Compressor Online - Reduce PDF File Size',
      description: 'Compress PDF documents online for free in your browser with high quality output.',
      keywords: 'pdf compressor, reduce pdf size, compress pdf online, shrink pdf'
    }
  },

  // 41. IMAGE TO PDF
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    category: 'pdf',
    icon: 'FileImage',
    popular: true,
    isPro: false,
    shortDescription: 'Convert JPG, PNG, and WebP images into a single organized, high-quality PDF document.',
    seo: {
      title: 'Free Image to PDF Converter - Convert JPG/PNG to PDF Online',
      description: 'Convert JPG, PNG, and WebP pictures to PDF document online for free with page reordering.',
      keywords: 'image to pdf, jpg to pdf, png to pdf, convert photos to pdf'
    }
  },

  // 42. IMAGE CONVERTER
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Format Converter',
    category: 'image',
    icon: 'ArrowRightLeft',
    popular: true,
    isPro: false,
    shortDescription: 'Convert between PNG, JPG, WebP, GIF, and BMP formats in batch mode with quality controls.',
    seo: {
      title: 'Free Image Converter - Convert PNG, JPG, WebP Online',
      description: 'Convert images between PNG, JPG, and WebP formats online for free with zero quality loss.',
      keywords: 'image converter, png to jpg, jpg to png, webp converter, convert image'
    }
  },

  // 43. PDF SPLITTER
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter & Extractor',
    category: 'pdf',
    icon: 'Scissors',
    popular: true,
    isPro: false,
    shortDescription: 'Extract specific page ranges or split all pages of a PDF document into separate files.',
    seo: {
      title: 'Free PDF Splitter Online - Extract Pages from PDF',
      description: 'Split PDF files and extract individual pages or custom page ranges online for free.',
      keywords: 'pdf splitter, split pdf, extract pdf pages, separate pdf'
    }
  },

  // 44. FILE ENCRYPTOR
  {
    id: 'file-encryptor',
    slug: 'file-encryptor',
    name: 'File Encryptor & Decryptor (AES-256)',
    category: 'security',
    icon: 'Lock',
    popular: true,
    isPro: false,
    shortDescription: 'Military-grade AES-GCM 256-bit password encryption and decryption for any file type.',
    seo: {
      title: 'Free File Encryptor & Decryptor - AES 256 Encryption Online',
      description: 'Encrypt and password protect any file with military-grade AES-256 encryption in your browser.',
      keywords: 'file encryptor, aes 256 encryption, password protect file, decrypt file'
    }
  },

  // 45. DATE CALCULATOR
  {
    id: 'date-calculator',
    slug: 'date-calculator',
    name: 'Date Difference & Time Calculator',
    category: 'calculator',
    icon: 'Calendar',
    isPro: false,
    shortDescription: 'Calculate exact difference between dates, business/working days, and add/subtract days.',
    seo: {
      title: 'Free Date Calculator - Date Difference & Business Days',
      description: 'Calculate days between dates, working days, and add or subtract time from any date online.',
      keywords: 'date calculator, date difference, days between dates, working days calculator'
    }
  },

  // 46. CURRENCY CONVERTER
  {
    id: 'currency-converter',
    slug: 'currency-converter',
    name: 'Real-Time Currency Converter',
    category: 'converter',
    icon: 'Coins',
    popular: true,
    isPro: false,
    shortDescription: 'Convert between 30+ world currencies with live exchange rates and comparison matrices.',
    seo: {
      title: 'Free Real-Time Currency Converter - Live Exchange Rates',
      description: 'Convert USD, INR, EUR, GBP, AED, and 30+ global currencies with real-time exchange rates.',
      keywords: 'currency converter, live exchange rates, usd to inr, euro to dollar'
    }
  },

  // 47. IMAGE CROPPER
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper & Aspect Ratio Tool',
    category: 'image',
    icon: 'Crop',
    popular: true,
    isPro: false,
    shortDescription: 'Crop photos with standard aspect ratios (1:1, 16:9, 9:16), rotate 90°, and flip.',
    seo: {
      title: 'Free Image Cropper Online - Crop Photos & Aspect Ratios',
      description: 'Crop images online for free with preset aspect ratios, rotation, and high resolution export.',
      keywords: 'image cropper, crop photo, crop image online, 1:1 square crop, aspect ratio crop'
    }
  },

  // 48. PDF TO WORD
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word Converter',
    category: 'pdf',
    icon: 'FileText',
    popular: true,
    isPro: false,
    shortDescription: 'Convert PDF documents into editable Microsoft Word (.doc / .docx) files with formatting preserved.',
    seo: {
      title: 'Free PDF to Word Converter Online - Convert PDF to DOC',
      description: 'Convert PDF files to editable Word documents online for free in your browser with zero data uploads.',
      keywords: 'pdf to word, convert pdf to doc, pdf to docx, editable word from pdf'
    }
  },

  // 49. PDF TO EXCEL
  {
    id: 'pdf-to-excel',
    slug: 'pdf-to-excel',
    name: 'PDF to Excel Converter',
    category: 'pdf',
    icon: 'FileSpreadsheet',
    popular: true,
    isPro: false,
    shortDescription: 'Extract tables, rows, columns, and financial data from PDF to Excel spreadsheet (.csv / .xlsx).',
    seo: {
      title: 'Free PDF to Excel Converter Online - Extract PDF Tables to XLSX',
      description: 'Extract tables and data from PDF into Excel sheets and CSV online for free.',
      keywords: 'pdf to excel, pdf to csv, extract tables from pdf, pdf to xlsx'
    }
  },

  // 50. PDF TO POWERPOINT
  {
    id: 'pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint Converter',
    category: 'pdf',
    icon: 'Presentation',
    popular: true,
    isPro: false,
    shortDescription: 'Convert PDF document pages into high-resolution PowerPoint presentation slide decks.',
    seo: {
      title: 'Free PDF to PowerPoint Converter Online - PDF to PPT',
      description: 'Convert PDF pages into presentation slides online for free with 1-click ZIP export.',
      keywords: 'pdf to powerpoint, pdf to ppt, convert pdf to slides, pdf presentation'
    }
  },

  // 51. WORD TO PDF
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF Converter',
    category: 'pdf',
    icon: 'FileText',
    popular: true,
    isPro: false,
    shortDescription: 'Convert Word documents (.docx/.doc) or text content into polished, formatted PDF files.',
    seo: {
      title: 'Free Word to PDF Converter - Convert DOCX to PDF Online',
      description: 'Convert Microsoft Word documents and text to PDF online for free in your browser.',
      keywords: 'word to pdf, docx to pdf, convert doc to pdf, text to pdf'
    }
  },

  // 52. EXCEL TO PDF
  {
    id: 'excel-to-pdf',
    slug: 'excel-to-pdf',
    name: 'Excel to PDF Converter',
    category: 'pdf',
    icon: 'FileSpreadsheet',
    isPro: false,
    shortDescription: 'Convert Excel spreadsheets, CSV data, and tables into printable landscape or portrait PDF documents.',
    seo: {
      title: 'Free Excel to PDF Converter Online - Convert XLSX/CSV to PDF',
      description: 'Convert spreadsheets and CSV tables into PDF documents online for free.',
      keywords: 'excel to pdf, csv to pdf, xlsx to pdf, table to pdf'
    }
  },

  // 53. POWERPOINT TO PDF
  {
    id: 'powerpoint-to-pdf',
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF Converter',
    category: 'pdf',
    icon: 'Presentation',
    isPro: false,
    shortDescription: 'Convert presentation slides into high-definition 16:9 PDF decks with slide numbers and headers.',
    seo: {
      title: 'Free PowerPoint to PDF Converter Online - Convert PPT to PDF',
      description: 'Convert slide decks and outlines into 16:9 presentation PDF files online for free.',
      keywords: 'powerpoint to pdf, ppt to pdf, convert slides to pdf, pptx to pdf'
    }
  },

  // 54. HTML TO PDF
  {
    id: 'html-to-pdf',
    slug: 'html-to-pdf',
    name: 'HTML to PDF Converter',
    category: 'pdf',
    icon: 'Code',
    popular: true,
    isPro: false,
    shortDescription: 'Render HTML/CSS code or web pages directly into print-ready A4 PDF documents.',
    seo: {
      title: 'Free HTML to PDF Converter Online - Convert Webpage & HTML to PDF',
      description: 'Convert HTML and CSS code to PDF documents online for free with live preview.',
      keywords: 'html to pdf, convert html to pdf, webpage to pdf, css to pdf'
    }
  },

  // 55. REMOVE PDF PAGES
  {
    id: 'remove-pdf-pages',
    slug: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    category: 'pdf',
    icon: 'Trash2',
    popular: true,
    isPro: false,
    shortDescription: 'Select and delete unwanted, blank, or duplicate pages from any PDF document.',
    seo: {
      title: 'Free PDF Page Remover - Delete Pages from PDF Online',
      description: 'Delete unnecessary or blank pages from your PDF file online for free with zero uploads.',
      keywords: 'remove pdf pages, delete pages from pdf, remove page from pdf'
    }
  },

  // 56. ROTATE PDF
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF Pages',
    category: 'pdf',
    icon: 'RotateCw',
    popular: true,
    isPro: false,
    shortDescription: 'Rotate individual pages or entire PDF document 90°, 180°, or 270° clockwise and save permanently.',
    seo: {
      title: 'Free PDF Rotator - Rotate PDF Pages Online',
      description: 'Rotate PDF pages clockwise or counter-clockwise online for free in your browser.',
      keywords: 'rotate pdf, rotate pdf pages, flip pdf, turn pdf'
    }
  },

  // 57. ADD PDF PAGE NUMBERS
  {
    id: 'add-pdf-page-numbers',
    slug: 'add-pdf-page-numbers',
    name: 'Add PDF Page Numbers',
    category: 'pdf',
    icon: 'Hash',
    isPro: false,
    shortDescription: 'Insert customizable page numbers, headers, and footers (Page X of Y) into any PDF.',
    seo: {
      title: 'Free Add Page Numbers to PDF Online - Number PDF Pages',
      description: 'Add page numbers, footers, and headers to your PDF documents online for free.',
      keywords: 'add page numbers to pdf, number pdf, pdf page counter'
    }
  },

  // 58. SIGN PDF
  {
    id: 'sign-pdf',
    slug: 'sign-pdf',
    name: 'Sign PDF (Digital Signature)',
    category: 'pdf',
    icon: 'PenTool',
    popular: true,
    isPro: false,
    shortDescription: 'Draw or type your signature and securely stamp it onto your PDF contracts and forms.',
    seo: {
      title: 'Free Sign PDF Online - Digital Signature on PDF',
      description: 'Sign PDF documents online for free with digital signature pad and instant download.',
      keywords: 'sign pdf, digital signature pdf, sign document online, electronic signature'
    }
  },

  // 59. PROTECT PDF
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF (Password Protect)',
    category: 'pdf',
    icon: 'Lock',
    popular: true,
    isPro: false,
    shortDescription: 'Encrypt your PDF with military-grade password security to prevent unauthorized access.',
    seo: {
      title: 'Free Password Protect PDF Online - Encrypt PDF',
      description: 'Set password protection and encrypt PDF documents online for free.',
      keywords: 'protect pdf, password protect pdf, encrypt pdf, lock pdf'
    }
  },

  // 60. UNLOCK PDF
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF (Remove Password)',
    category: 'pdf',
    icon: 'Unlock',
    popular: true,
    isPro: false,
    shortDescription: 'Remove password protection, printing restrictions, and copying permissions from PDF files.',
    seo: {
      title: 'Free Unlock PDF Online - Remove PDF Password & Security',
      description: 'Remove password security and permission locks from PDF files online for free.',
      keywords: 'unlock pdf, remove pdf password, decrypt pdf, unlock protected pdf'
    }
  },

  // 61. OCR PDF
  {
    id: 'ocr-pdf',
    slug: 'ocr-pdf',
    name: 'OCR PDF (Text Recognition)',
    category: 'pdf',
    icon: 'ScanText',
    popular: true,
    isPro: false,
    shortDescription: 'Extract searchable, editable text and paragraphs from scanned PDF documents.',
    seo: {
      title: 'Free OCR PDF Online - Optical Character Recognition on PDF',
      description: 'Extract text from scanned PDF files online for free in your browser with 100% privacy.',
      keywords: 'ocr pdf, extract text from pdf, scanned pdf to text, pdf text recognition'
    }
  },

  // 62. REPAIR PDF
  {
    id: 'repair-pdf',
    slug: 'repair-pdf',
    name: 'Repair PDF (Fix Corrupted File)',
    category: 'pdf',
    icon: 'Wrench',
    isPro: false,
    shortDescription: 'Fix damaged, broken, or unreadable PDF files by rebuilding object tables and page streams.',
    seo: {
      title: 'Free PDF Repair Tool Online - Fix Corrupted PDF',
      description: 'Recover and fix broken or corrupted PDF documents online for free.',
      keywords: 'repair pdf, fix corrupted pdf, recover damaged pdf, pdf repair tool'
    }
  },

  // 63. EDIT PDF
  {
    id: 'edit-pdf',
    slug: 'edit-pdf',
    name: 'Edit PDF (Add Text & Annotate)',
    category: 'pdf',
    icon: 'Edit3',
    popular: true,
    isPro: false,
    shortDescription: 'Add text, stamps, approval badges, and custom annotations directly onto PDF pages.',
    seo: {
      title: 'Free PDF Editor Online - Add Text & Annotations to PDF',
      description: 'Edit PDF documents online for free. Add text, annotations, and approvals in browser.',
      keywords: 'edit pdf, pdf editor, annotate pdf, add text to pdf'
    }
  },

  // 64. REDACT PDF
  {
    id: 'redact-pdf',
    slug: 'redact-pdf',
    name: 'Redact PDF (Blackout Sensitive Info)',
    category: 'pdf',
    icon: 'EyeOff',
    popular: true,
    isPro: false,
    shortDescription: 'Permanently blackout and censor sensitive text, confidential names, and account numbers.',
    seo: {
      title: 'Free Redact PDF Online - Blackout Sensitive Text in PDF',
      description: 'Censor and blackout sensitive information in PDF files online for free.',
      keywords: 'redact pdf, blackout pdf, censor pdf text, sanitize pdf'
    }
  },

  // 65. COMPARE PDF
  {
    id: 'compare-pdf',
    slug: 'compare-pdf',
    name: 'Compare PDF (Side-by-Side Diff)',
    category: 'pdf',
    icon: 'GitCompare',
    isPro: false,
    shortDescription: 'Compare two PDF documents side-by-side to highlight text changes, edits, and revisions.',
    seo: {
      title: 'Free Compare PDF Online - PDF Difference & Revision Checker',
      description: 'Compare two PDF versions side-by-side to inspect changes and differences online for free.',
      keywords: 'compare pdf, pdf diff, compare two pdfs, pdf revision checker'
    }
  },

  // 66. CROP PDF
  {
    id: 'crop-pdf',
    slug: 'crop-pdf',
    name: 'Crop PDF Page Margins',
    category: 'pdf',
    icon: 'Crop',
    isPro: false,
    shortDescription: 'Trim margins, white borders, and header/footer space across PDF document pages.',
    seo: {
      title: 'Free Crop PDF Online - Trim PDF Page Margins',
      description: 'Crop PDF pages and trim white margins online for free in your browser.',
      keywords: 'crop pdf, trim pdf margins, cut pdf borders, pdf cropper'
    }
  }
];



