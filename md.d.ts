declare module '*.md' {
  const attributes: IMarkdownFile['attributes']
  const html: IMarkdownFile['html']
  export { html, attributes }
}
