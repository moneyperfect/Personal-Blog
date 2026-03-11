import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export interface MarkdownHeadingAnchor {
    id: string;
    level: 2 | 3;
    line: number;
}

interface MarkdownRendererProps {
    content: string;
    className?: string;
    headings?: MarkdownHeadingAnchor[];
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

function withoutNode<T extends { node?: unknown }>(props: T): Omit<T, 'node'> {
    const rest = { ...props };
    delete rest.node;
    return rest;
}

function withoutCheckboxRuntimeProps<
    T extends {
        node?: unknown;
        type?: unknown;
        disabled?: unknown;
        readOnly?: unknown;
    }
>(props: T): Omit<T, 'node' | 'type' | 'disabled' | 'readOnly'> {
    const rest = { ...props };
    delete rest.node;
    delete rest.type;
    delete rest.disabled;
    delete rest.readOnly;
    return rest;
}

function withoutImageRuntimeProps<T extends { node?: unknown; loading?: unknown }>(
    props: T
): Omit<T, 'node' | 'loading'> {
    const rest = { ...props };
    delete rest.node;
    delete rest.loading;
    return rest;
}

function getHeadingId(
    level: 2 | 3,
    line: number | undefined,
    headings: MarkdownHeadingAnchor[]
) {
    const heading = headings.find((entry) => entry.level === level && entry.line === line);
    return heading?.id || `section-${line || 1}`;
}

export default function MarkdownRenderer({
    content,
    className,
    headings = [],
}: MarkdownRendererProps) {
    const components: Components = {
        h1: ({ className: headingClassName, ...props }) => (
            <h1
                className={joinClasses(
                    'mb-5 mt-10 text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl',
                    headingClassName
                )}
                {...withoutNode(props)}
            />
        ),
        h2: ({ node, className: headingClassName, ...props }) => (
            <h2
                id={getHeadingId(2, node?.position?.start?.line, headings)}
                className={joinClasses(
                    'scroll-mt-24 mb-4 mt-12 text-2xl font-semibold tracking-tight text-surface-900 sm:text-[1.9rem]',
                    headingClassName
                )}
                {...props}
            />
        ),
        h3: ({ node, className: headingClassName, ...props }) => (
            <h3
                id={getHeadingId(3, node?.position?.start?.line, headings)}
                className={joinClasses(
                    'scroll-mt-24 mb-3 mt-9 text-xl font-semibold tracking-tight text-surface-900 sm:text-2xl',
                    headingClassName
                )}
                {...props}
            />
        ),
        h4: ({ className: headingClassName, ...props }) => (
            <h4
                className={joinClasses(
                    'mb-3 mt-8 text-lg font-semibold text-surface-900',
                    headingClassName
                )}
                {...withoutNode(props)}
            />
        ),
        p: ({ className: paragraphClassName, ...props }) => (
            <p
                className={joinClasses(
                    'my-5 break-words text-[1.02rem] leading-8 text-surface-800',
                    paragraphClassName
                )}
                {...withoutNode(props)}
            />
        ),
        a: ({ href, className: linkClassName, children, title, ...props }) => {
            const mergedClassName = joinClasses(
                'break-words font-medium text-primary-700 underline decoration-primary-200 underline-offset-4 transition-colors hover:text-primary-900 hover:decoration-primary-400',
                linkClassName
            );

            if (!href) {
                return (
                    <span className={mergedClassName} title={title}>
                        {children}
                    </span>
                );
            }

            if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
                return (
                    <Link href={href} className={mergedClassName} title={title}>
                        {children}
                    </Link>
                );
            }

            const shouldOpenInNewTab = !href.startsWith('#')
                && !href.startsWith('mailto:')
                && !href.startsWith('tel:');

            return (
                <a
                    href={href}
                    className={mergedClassName}
                    title={title}
                    target={shouldOpenInNewTab ? '_blank' : undefined}
                    rel={shouldOpenInNewTab ? 'noreferrer noopener' : undefined}
                    {...withoutNode(props)}
                >
                    {children}
                </a>
            );
        },
        ul: ({ className: listClassName, ...props }) => {
            const isTaskList = listClassName?.includes('contains-task-list');

            return (
                <ul
                    className={joinClasses(
                        'my-5 space-y-3 text-[1.02rem] leading-8 text-surface-800',
                        isTaskList ? 'list-none ps-0' : 'list-disc ps-6 marker:text-primary-500',
                        listClassName
                    )}
                    {...withoutNode(props)}
                />
            );
        },
        ol: ({ className: listClassName, ...props }) => (
            <ol
                className={joinClasses(
                    'my-5 list-decimal space-y-3 ps-6 text-[1.02rem] leading-8 text-surface-800 marker:font-semibold marker:text-surface-700',
                    listClassName
                )}
                {...withoutNode(props)}
            />
        ),
        li: ({ className: itemClassName, ...props }) => (
            <li
                className={joinClasses(
                    'ps-1',
                    itemClassName?.includes('task-list-item') && 'list-none ps-0',
                    itemClassName
                )}
                {...withoutNode(props)}
            />
        ),
        input: ({ checked, className: inputClassName, ...props }) => (
            <input
                checked={checked}
                className={joinClasses(
                    'mr-3 h-4 w-4 rounded border-surface-400 align-middle accent-primary-600',
                    inputClassName
                )}
                disabled
                readOnly
                type="checkbox"
                {...withoutCheckboxRuntimeProps(props)}
            />
        ),
        blockquote: ({ className: quoteClassName, ...props }) => (
            <blockquote
                className={joinClasses(
                    'my-8 rounded-r-google-lg border-l-4 border-primary-500 bg-primary-50/70 px-5 py-4 text-surface-700 shadow-sm',
                    quoteClassName
                )}
                {...withoutNode(props)}
            />
        ),
        hr: ({ className: ruleClassName, ...props }) => (
            <hr
                className={joinClasses('my-10 border-surface-200', ruleClassName)}
                {...withoutNode(props)}
            />
        ),
        table: ({ className: tableClassName, ...props }) => (
            <div className="my-8 overflow-x-auto rounded-google-lg border border-surface-200 bg-white shadow-card">
                <table
                    className={joinClasses(
                        'min-w-full border-collapse text-left text-sm leading-6',
                        tableClassName
                    )}
                    {...withoutNode(props)}
                />
            </div>
        ),
        thead: ({ className: tableHeadClassName, ...props }) => (
            <thead
                className={joinClasses('bg-surface-100/90', tableHeadClassName)}
                {...withoutNode(props)}
            />
        ),
        tbody: ({ className: tableBodyClassName, ...props }) => (
            <tbody
                className={joinClasses('bg-white', tableBodyClassName)}
                {...withoutNode(props)}
            />
        ),
        tr: ({ className: rowClassName, ...props }) => (
            <tr
                className={joinClasses(
                    'border-b border-surface-200 last:border-b-0 even:bg-surface-50/50',
                    rowClassName
                )}
                {...withoutNode(props)}
            />
        ),
        th: ({ className: cellClassName, ...props }) => (
            <th
                className={joinClasses(
                    'px-4 py-3 align-top text-xs font-semibold uppercase tracking-[0.08em] text-surface-700',
                    cellClassName
                )}
                {...withoutNode(props)}
            />
        ),
        td: ({ className: cellClassName, ...props }) => (
            <td
                className={joinClasses('px-4 py-3 align-top text-surface-700', cellClassName)}
                {...withoutNode(props)}
            />
        ),
        pre: ({ className: preClassName, ...props }) => (
            <pre
                className={joinClasses(
                    'my-8 overflow-x-auto rounded-google-lg border border-surface-700/20 bg-[#17202b] px-4 py-4 text-sm leading-7 text-surface-100 shadow-elevated-1 sm:px-5',
                    preClassName
                )}
                {...withoutNode(props)}
            />
        ),
        code: ({ className: codeClassName, children, ...props }) => {
            const code = String(children).replace(/\n$/, '');
            const isBlock = Boolean(codeClassName) || code.includes('\n');

            if (isBlock) {
                return (
                    <code
                        className={joinClasses(
                            'font-mono text-sm text-surface-100',
                            codeClassName
                        )}
                        {...withoutNode(props)}
                    >
                        {code}
                    </code>
                );
            }

            return (
                <code
                    className={joinClasses(
                        'rounded-md border border-surface-200 bg-surface-100 px-1.5 py-1 font-mono text-[0.92em] text-primary-900',
                        codeClassName
                    )}
                    {...withoutNode(props)}
                >
                    {children}
                </code>
            );
        },
        img: ({ src, alt, title, ...props }) => {
            if (!src) {
                return null;
            }

            return (
                <figure className="my-8 overflow-hidden rounded-google-lg border border-surface-200 bg-white shadow-card">
                    {/* Using img keeps markdown image URLs flexible for CMS-hosted and external assets. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt || ''}
                        title={title}
                        className="h-auto w-full bg-surface-100 object-cover"
                        loading="lazy"
                        {...withoutImageRuntimeProps(props)}
                    />
                    {alt ? (
                        <figcaption className="border-t border-surface-200 bg-surface-50 px-4 py-3 text-sm leading-6 text-surface-600">
                            {alt}
                        </figcaption>
                    ) : null}
                </figure>
            );
        },
        strong: ({ className: strongClassName, ...props }) => (
            <strong
                className={joinClasses('font-semibold text-surface-900', strongClassName)}
                {...withoutNode(props)}
            />
        ),
        del: ({ className: delClassName, ...props }) => (
            <del
                className={joinClasses('text-surface-600', delClassName)}
                {...withoutNode(props)}
            />
        ),
    };

    return (
        <article
            className={joinClasses(
                'max-w-none pb-8 text-base text-surface-800',
                className
            )}
        >
            <ReactMarkdown
                components={components}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
