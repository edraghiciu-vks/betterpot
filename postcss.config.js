export default (ctx) => {
  // Only apply Tailwind to global.css and files that contain @tailwind directives
  const shouldUseTailwind = ctx.file && (
    ctx.file.includes('global.css') || 
    ctx.from && ctx.from.includes('@tailwind')
  );

  return {
    plugins: {
      ...(shouldUseTailwind && {
        tailwindcss: { config: './tailwind.config.cjs' }
      }),
      autoprefixer: {},
    },
  };
}
