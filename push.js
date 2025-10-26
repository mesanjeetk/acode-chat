import { execSync } from "child_process";

async function main() {
  // Get commit message from CLI args
  const message = process.argv.slice(2).join(" ");

  if (!message) {
    console.error("❌ Please provide a commit message.\nExample: npm run push 'update UI layout'");
    process.exit(1);
  }

  try {
    console.log("🏗️  Building project...");
    execSync("npm run build", { stdio: "inherit" });

    console.log("📦 Adding changes...");
    execSync("git add .", { stdio: "inherit" });

    console.log(`📝 Committing with message: "${message}"`);
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });

    console.log("🚀 Pushing to remote...");
    execSync("git push", { stdio: "inherit" });

    console.log("✅ All done!");
  } catch (err) {
    console.error("❌ An error occurred:");
    console.error(err.message);
    process.exit(1);
  }
}

main();
