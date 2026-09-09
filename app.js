const candidateImages = [
  "https://cdn.phototourl.com/free/2026-09-08-f39edcd3-7e5a-433b-986f-8eda79334902.jpg",
  "https://cdn.phototourl.com/free/2026-09-08-f9bfadb8-ed9f-45ae-a1c5-ec0e383aca8e.jpg",
  "https://cdn.phototourl.com/free/2026-09-08-9b2e042e-877c-4c82-9965-f3cf321b2668.jpg",
  "https://cdn.phototourl.com/free/2026-09-08-279e090e-72d8-48f1-a6cd-dc0ebc92bc78.jpg",
  "https://cdn.phototourl.com/free/2026-09-08-b591c340-def1-40dc-9969-7fac1b3d2385.jpg",
  "https://cdn.phototourl.com/member/2026-09-08-400cf7d6-2a74-4a0c-8f28-48880d5ac4e0.jpg",
  "https://cdn.phototourl.com/member/2026-09-08-f3ce67d2-406a-45c5-9b87-bec8e2fa914b.jpg"
];

console.log("Checking image URLs accessibility...");
const validImageContent = [];
for (let i = 0; i < candidateImages.length; i++) {
  const url = candidateImages[i];
  try {
    const check = await fetch(url, { method: "HEAD" });
    if (check.ok) {
      console.log(`[OK] Image ${i + 1}: ${url}`);
      validImageContent.push({
        type: "input_image",
        image_url: url
      });
    } else {
      console.warn(`[Skipped] Image ${i + 1} (${check.status} Not Found): ${url}`);
    }
  } catch (err) {
    console.warn(`[Skipped] Image ${i + 1} unreachable: ${err.message}`);
  }
}

console.log(`\nConnecting to Kie Codex API (model: gpt-6-astra) with ${validImageContent.length} photos...\n`);

const response = await fetch(
  "https://api.kie.ai/codex/v1/responses",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer 1ee76219f70727e89218200b707f179b",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-6-astra",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `These are photographs of the SAME building.

Analyze all photographs together and reconstruct the building as a complete,
high-fidelity 3D digital twin.

Preserve the exact architecture, proportions, materials, colors,
weathering, dirt, stains, cracks, windows, columns, balconies,
entrance, atrium, skylight, pipes, AC units and other details.

Do not redesign or beautify the building.

Use the photographs as the primary source of truth.`
            },
            ...validImageContent
          ]
        }
      ],

      reasoning: {
        effort: "high"
      },

      stream: true
    })
  }
);

if (!response.ok) {
  const errText = await response.text();
  console.error(`HTTP Error: ${response.status} ${response.statusText}\n${errText}`);
  process.exit(1);
}

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = "";
let accumulatedText = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split("\n");
  buffer = lines.pop();

  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const dataStr = line.slice(6).trim();
      if (dataStr === "[DONE]") break;
      try {
        const payload = JSON.parse(dataStr);
        if (payload.delta) {
          process.stdout.write(payload.delta);
          accumulatedText += payload.delta;
        }
      } catch (e) {
        // Ignore unparseable SSE frame
      }
    }
  }
}

console.log("\n\n--- Finished Execution ---");