import "dotenv/config";
import { ResourceService } from "../src/modules/resources/resource.service";
import { resolveResourcePreviewImage } from "../src/lib/resource-preview-cache";

async function main() {
  const service = new ResourceService();
  const resources = await service.getAllResource();

  let ok = 0;
  let fail = 0;

  for (const resource of resources) {
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

  console.log(`Previews actualizados: ${ok} | fallidos: ${fail}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
