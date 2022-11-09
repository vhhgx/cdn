const Fontmin = require('fontmin');
const fonts = require('./fonts.js');

// 要转换的文字路径
const filePath = "fonts/icon/material-design-icons/md-icon.ttf"
// 转换后的存放路径
const exportPath = "build/fonts"
// 转为css时的文字名
// const fontName = "wyxqn"

const fontmin = new Fontmin()
  .src(filePath)
  // .use(
  //   Fontmin.glyph({
  //     text: fonts.common,
  //     hinting: false // keep ttf hint info (fpgm, prep, cvt). default = true
  //   })
  // )
	.use(
		Fontmin.ttf2woff({ deflate: true })
	)
	.use(
		Fontmin.ttf2woff2({ deflate: true })
	)
  .use(
  	// Fontmin.css({ fontFamily: fontName, base64: true })
  	Fontmin.css({ base64: true })

  )
  .dest(exportPath);

fontmin.run();