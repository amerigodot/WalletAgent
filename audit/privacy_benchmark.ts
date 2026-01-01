import { EncryptionService } from '../src/utils/encryption';
import { performance } from 'perf_hooks';

async function runBenchmark() {
  console.log('🔒 Starting Privacy Metrics Benchmark...');

  const password = 'benchmark-password-strong-enough';
  const payload = 'This is a sample sensitive payload representing a private key or mnemonic.';

  // Warmup
  await EncryptionService.init();

  // Measure Encryption
  const startEnc = performance.now();
  const encrypted = await EncryptionService.encrypt(payload, password);
  const endEnc = performance.now();
  const encTime = endEnc - startEnc;

  console.log(`Encryption Time: ${encTime.toFixed(2)}ms`);

  // Measure Decryption
  const startDec = performance.now();
  const decrypted = await EncryptionService.decrypt(encrypted, password);
  const endDec = performance.now();
  const decTime = endDec - startDec;

  console.log(`Decryption Time: ${decTime.toFixed(2)}ms`);

  if (encTime < 200 && decTime < 200) {
    console.log('✅ Latency Check PASSED (< 200ms)');
    process.exit(0);
  } else {
    console.error('❌ Latency Check FAILED (> 200ms)');
    process.exit(1);
  }
}

runBenchmark();
