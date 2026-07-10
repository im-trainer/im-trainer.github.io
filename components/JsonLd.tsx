// Renders a JSON-LD structured-data <script> tag. Server component.
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe inside a <script type="application/ld+json">.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
