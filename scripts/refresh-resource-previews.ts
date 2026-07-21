import "dotenv/config";
import { ResourceService } from "../src/modules/resources/resource.service";
import { resolveResourcePreviewImage } from "../src/lib/resource-preview-cache";

const SKIP_RESOURCE_IDS = new Set<number>([
  9, 13, 19, 20, 27, 29,
]);

async function main() {
  const service = new ResourceService();
  const resources = await service.getAllResource();

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  for (const resource of resources) {
    if (SKIP_RESOURCE_IDS.has(resource.id_recurso)) {
      skipped += 1;
      console.log(`SKIP recurso ${resource.id_recurso} (${resource.nombre})`);
      continue;
    }

    const title = resource.nombre ?? `Recurso #${resource.id_recurso}`;

    try {
      await resolveResourcePreviewImage({
        resourceId: resource.id_recurso,
        rawUrl: resource.url,
        title,
        forceRefresh: true,
      });

      ok += 1;
      console.log(`OK preview actualizado para recurso ${resource.id_recurso}`);
    } catch (error) {
      fail += 1;
      console.error(`FAIL recurso ${resource.id_recurso}`, error);
    }
  }

  console.log(`Previews actualizados: ${ok} | fallidos: ${fail} | saltados: ${skipped}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
