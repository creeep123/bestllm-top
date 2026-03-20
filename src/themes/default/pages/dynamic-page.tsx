import { getThemeBlock } from '@/core/theme';
import type { DynamicPage as DynamicPageType } from '@/shared/types/blocks/landing';

export default async function DynamicPage({
  locale,
  page,
  data,
}: {
  locale?: string;
  page: DynamicPageType;
  data?: Record<string, any>;
}) {
  // Filter and prepare sections first
  const sectionKeys = page?.sections
    ? Object.keys(page.sections).filter((sectionKey: string) => {
        const section = page.sections?.[sectionKey];
        if (!section || section.disabled === true) {
          return false;
        }

        if (page.show_sections && !page.show_sections.includes(sectionKey)) {
          return false;
        }

        return true;
      })
    : [];

  // Load all blocks in parallel
  const sections = await Promise.all(
    sectionKeys.map(async (sectionKey: string) => {
      const section = page.sections?.[sectionKey];
      const block = section.block || section.id || sectionKey;

      try {
        if (section.component) {
          return { key: sectionKey, component: section.component };
        }

        const DynamicBlock = await getThemeBlock(block);
        return {
          key: sectionKey,
          component: (
            <DynamicBlock
              key={sectionKey}
              section={section}
              {...(data || section.data || {})}
            />
          ),
        };
      } catch (error) {
        return { key: sectionKey, component: null };
      }
    })
  );

  return (
    <>
      {page.title && !page.sections?.hero && (
        <h1 className="sr-only">{page.title}</h1>
      )}
      {sections.map((section) => section.component)}
    </>
  );
}
