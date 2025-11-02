# Toonfetch Playground

Bu klasör, Toonfetch paketini test etmek için kullanılır.

## Kurulum

```bash
# Bağımlılıkları yükle
pnpm install
```

## Kullanım

```bash
# TypeScript type checking
pnpm type-check

# Örneği çalıştır
pnpm dev
```

## Örnek Kullanım

### Ory Kratos

```typescript
import { createClient, kratos } from 'toonfetch/ory'

// Client oluştur
const client = createClient({
  baseURL: 'https://your-kratos-instance.com',
}).with(kratos)

// API çağrısı yap
const response = await client('/schemas/{id}', {
  method: 'GET',
  path: { id: 'default' },
})
```

### Ory Hydra

```typescript
import { createClient, hydra } from 'toonfetch/ory'

// Client oluştur
const client = createClient({
  baseURL: 'https://your-hydra-instance.com',
}).with(hydra)

// API çağrısı yap
const response = await client('/admin/clients', {
  method: 'GET',
  query: { page_size: 10 },
})
```

## Özellikler

✅ Tam TypeScript desteği
✅ Otomatik tip çıkarımı
✅ IntelliSense ve autocomplete
✅ Derlenmiş tip tanımları
