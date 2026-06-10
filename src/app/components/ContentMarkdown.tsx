'use client';

import React from 'react';
import { formatMarkdownContent } from '../utils/formatters';
import PlayerLink from './PlayerLink';

interface MarkdownPart {
  _entityId: string;
  content: string;
}
interface ContentMarkdownProps {
  part: MarkdownPart;
}

const PLAYER_PATH_PATTERN = /^\/player\/(?:.*-)?(\d+)\/?$/;
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const renderNode = (node: Node, key: string): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const el = node as HTMLElement;
  const children = Array.from(el.childNodes).map((child, i) => renderNode(child, `${key}-${i}`));

  const tagName = el.tagName.toLowerCase();

  if (tagName === 'a') {
    const href = el.getAttribute('href') || '';
    const match = href.match(PLAYER_PATH_PATTERN);

    if (match) {
      return (
        <PlayerLink key={key} playerId={match[1]} className={el.getAttribute('class') || undefined}>
          {children}
        </PlayerLink>
      );
    }
  }

  const props: Record<string, string> = {};
  Array.from(el.attributes).forEach((attr) => {
    if (attr.name === 'class') {
      props.className = attr.value;

      return;
    }

    props[attr.name] = attr.value;
  });

  if (VOID_ELEMENTS.has(tagName)) {
    return React.createElement(tagName, { key, ...props });
  }

  return React.createElement(tagName, { key, ...props }, children);
};

const renderMarkdownWithPlayerLinks = (html: string): React.ReactNode[] => {
  if (typeof DOMParser === 'undefined') {
    return [<div key="content" dangerouslySetInnerHTML={{ __html: html }} />];
  }

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;

  if (!root) {
    return [];
  }

  return Array.from(root.childNodes).map((node, i) => renderNode(node, `node-${i}`));
};

const ContentMarkdown: React.FC<ContentMarkdownProps> = ({ part }) => {
  const { _entityId, content } = part;
  const html = formatMarkdownContent(content);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div key={_entityId} className="my-5">
      {hydrated ? (
        <div>{renderMarkdownWithPlayerLinks(html)}</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
};

export default ContentMarkdown;
