import React from 'react'

const BLOCK_TAGS = {
  blockquote: 'quote',
  p: 'paragraph',
  pre: 'code',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const regex = /<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:"[^"]*"|"[^"]*"|[\w\-.:]+))?)*\s*\/?>\s*<\/\1\s*>/gim

const rules = [
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'p') {
        if (el.innerHTML) {
          return {
            kind: 'block',
            type: 'paragraph',
            data: {},
            nodes: next(el.childNodes)
          }
        }
      }
      if (el.tagName.toLowerCase() === 'h1') {
        return {
          kind: 'block',
          type: 'heading-one',
          data: {},
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'h2') {
        return {
          kind: 'block',
          type: 'heading-two',
          data: {},
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'em') {
        return {
          kind: 'block',
          type: 'italic',
          data: {},
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'code') {
        return {
          kind: 'block',
          type: 'code',
          data: {},
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'block-quote') {
        return {
          kind: 'block',
          type: 'block-quote',
          data: {},
          nodes: next(el.childNodes)
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'italic':
            return <em>{children}</em>
          case 'em':
              return <em>{children}</em>
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            )
          case "heading-one":
            return <h1>{children}</h1>;
          case "heading-two":
            return <h2>{children}</h2>;
          case 'block-quote':
            return (
              <blockquote>
                <span>{children}</span>
              </blockquote>
            )
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'quote':
            return <blockquote>{children}</blockquote>
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          kind: 'inline',
          type: 'link',
          data: {
            href: el.getAttribute('href')
          },
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'bold') {
        return {
          kind: 'inline',
          type: 'bold',
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'italic') {
        return {
          kind: 'inline',
          type: 'italic',
          nodes: next(el.childNodes)
        }
      }
      if (el.tagName.toLowerCase() === 'em') {
        return {
          kind: 'inline',
          type: 'italic',
          nodes: next(el.childNodes)
        }
      }
    },
    serialize(obj, children) {
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'link':
            return <>{children}</>
          case 'italic':
            return <em>{children}</em>
        }
      }
      if (obj.type === 'link') {
        const { data } = obj
          const href = data.get('href')
          return (
            <a href={href}>
              {children}
            </a>
          )
      }
    },
  },
]

export default rules