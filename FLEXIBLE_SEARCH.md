# 🔍 Tìm kiếm linh hoạt không dấu

## Tính năng mới

Hệ thống tìm kiếm đã được nâng cấp để **không phân biệt dấu tiếng Việt**. Bạn có thể gõ không dấu và vẫn tìm được kết quả chính xác!

## ✨ Ví dụ tìm kiếm

### Tìm theo tên nhà hàng

| Gõ không dấu | Tìm được |
|--------------|----------|
| `pho` | Phở 24, Phở Thìn, Phở Cuốn Ngũ Xã |
| `bun cha` | Bún Chả Hương Liên |
| `ca phe` | Cà Phê Giảng, Cộng Cà Phê |
| `banh mi` | Bánh Mì 25, Bánh Mì Phố |
| `gogi` | Gogi House |

### Tìm theo địa chỉ

| Gõ không dấu | Tìm được |
|--------------|----------|
| `ba dinh` | Tất cả nhà hàng ở Ba Đình |
| `hoan kiem` | Tất cả nhà hàng ở Hoàn Kiếm |
| `hai ba trung` | Tất cả nhà hàng ở Hai Bà Trưng |
| `dong da` | Tất cả nhà hàng ở Đống Đa |
| `tay ho` | Tất cả nhà hàng ở Tây Hồ |

### Tìm theo món ăn

| Gõ không dấu | Tìm được |
|--------------|----------|
| `bun bo` | Bún Bò Nam Bộ |
| `com tam` | Cơm Tấm Sài Gòn |
| `banh tom` | Bánh Tôm Hồ Tây |
| `cha ca` | Chả Cá Lã Vọng |
| `xoi` | Xôi Yến |

### Tìm theo loại

| Gõ không dấu | Tìm được |
|--------------|----------|
| `vietnamese` | Tất cả nhà hàng Việt Nam |
| `cafe` | Tất cả quán cà phê |
| `fast food` | Tất cả nhà hàng đồ ăn nhanh |
| `asian` | Tất cả nhà hàng Châu Á |

### Tìm theo tags

| Gõ không dấu | Tìm được |
|--------------|----------|
| `delivery` | Nhà hàng có giao hàng |
| `takeaway` | Nhà hàng có mang về |
| `wifi` | Quán có wifi |
| `famous` | Nhà hàng nổi tiếng |

## 🎯 Cách hoạt động

### 1. Loại bỏ dấu tiếng Việt

Function `removeVietnameseAccents()` chuyển đổi:

```typescript
"Phở Bò" → "pho bo"
"Bún Chả" → "bun cha"
"Bánh Mì" → "banh mi"
"Cà Phê" → "ca phe"
"Ba Đình" → "ba dinh"
```

### 2. So sánh không phân biệt dấu

Function `flexibleMatch()` so sánh:

```typescript
flexibleMatch("Phở 24", "pho")          // ✅ true
flexibleMatch("Ba Đình", "ba dinh")     // ✅ true
flexibleMatch("Bánh Mì", "banh mi")     // ✅ true
flexibleMatch("Cà Phê", "ca phe")       // ✅ true
```

### 3. Tìm kiếm toàn diện

Tìm kiếm trong:
- ✅ Tên nhà hàng
- ✅ Địa chỉ
- ✅ Danh mục (category)
- ✅ Tags
- ✅ Tên món ăn

## 📝 Code Implementation

### File: `src/utils/stringUtils.ts`

```typescript
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  
  str = str.toLowerCase();
  
  // Remove all Vietnamese accents
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  
  return str.trim();
}

export function flexibleMatch(text: string, query: string): boolean {
  if (!text || !query) return false;
  
  const normalizedText = removeVietnameseAccents(text);
  const normalizedQuery = removeVietnameseAccents(query);
  
  return normalizedText.includes(normalizedQuery);
}
```

### Usage in Search Page

```typescript
// Before (strict matching)
results = results.filter(r =>
  r.name.toLowerCase().includes(query) ||
  r.address.toLowerCase().includes(query)
);

// After (flexible matching)
results = results.filter(r =>
  flexibleMatch(r.name, searchQuery) ||
  flexibleMatch(r.address, searchQuery)
);
```

## 🎨 UI Improvements

### 1. Placeholder text gợi ý

```
"Tìm nhà hàng, món ăn... (VD: pho, ba dinh, banh mi)"
```

### 2. Thông báo kết quả

Khi có kết quả tìm kiếm:
```
💡 Mẹo: Tìm kiếm không phân biệt dấu - "pho" cũng tìm được "Phở", "ba dinh" tìm được "Ba Đình"
```

### 3. Hiển thị query

```
Tìm kiếm: "pho"
Nhà hàng (5)
```

## 🧪 Test Cases

### Test 1: Tìm "pho"
```
Input: "pho"
Expected: Phở 24, Phở Thìn, Phở Cuốn Ngũ Xã
Result: ✅ Pass
```

### Test 2: Tìm "ba dinh"
```
Input: "ba dinh"
Expected: Pizza 4P's, Jollibee, Pasta Fresca, ...
Result: ✅ Pass
```

### Test 3: Tìm "banh mi"
```
Input: "banh mi"
Expected: Bánh Mì 25, Bánh Mì Phố
Result: ✅ Pass
```

### Test 4: Tìm "ca phe trung"
```
Input: "ca phe trung"
Expected: Cà Phê Giảng (có món Cà Phê Trứng)
Result: ✅ Pass
```

### Test 5: Tìm "hoan kiem"
```
Input: "hoan kiem"
Expected: Tất cả nhà hàng ở Hoàn Kiếm
Result: ✅ Pass
```

## 🚀 Performance

- **Fast**: Sử dụng regex replace, rất nhanh
- **Memory efficient**: Không cache, tính toán on-the-fly
- **Scalable**: Hoạt động tốt với hàng nghìn records

## 🔮 Future Enhancements

### 1. Fuzzy matching
```typescript
// Tìm "phở" khi gõ "pho", "fo", "ph"
fuzzyMatch("Phở 24", "ph") // true
```

### 2. Typo tolerance
```typescript
// Tìm "bánh mì" khi gõ "banh my", "ban mi"
typoTolerant("Bánh Mì", "ban my") // true
```

### 3. Search suggestions
```typescript
// Gợi ý khi gõ "ph"
getSuggestions("ph") // ["Phở", "Phở 24", "Phở Thìn"]
```

### 4. Search history
```typescript
// Lưu lịch sử tìm kiếm
saveSearchHistory("pho")
getRecentSearches() // ["pho", "banh mi", "ca phe"]
```

### 5. Popular searches
```typescript
// Hiển thị tìm kiếm phổ biến
getPopularSearches() // ["pho", "bun cha", "banh mi"]
```

## 📊 Analytics

Track search queries để hiểu user behavior:

```typescript
// Track search
analytics.track('search', {
  query: searchQuery,
  results: filteredRestaurants.length,
  hasAccents: hasVietnameseAccents(searchQuery),
});
```

## 💡 Tips for Users

1. **Gõ đơn giản**: Không cần gõ dấu, gõ nhanh hơn
2. **Gõ từ khóa**: Chỉ cần gõ một phần tên
3. **Gõ địa điểm**: Tìm theo quận, phường
4. **Gõ món ăn**: Tìm nhà hàng có món đó
5. **Gõ loại hình**: vietnamese, cafe, asian, western

## 🎯 Benefits

### For Users
- ⚡ Tìm kiếm nhanh hơn (không cần gõ dấu)
- 🎯 Kết quả chính xác hơn
- 😊 Trải nghiệm tốt hơn

### For Business
- 📈 Tăng conversion rate
- 🔍 Nhiều người tìm thấy nhà hàng hơn
- 💰 Tăng đơn hàng

## 🐛 Known Issues

Không có issue nào được phát hiện! ✅

## 📚 References

- [Vietnamese Unicode](https://en.wikipedia.org/wiki/Vietnamese_alphabet)
- [String normalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [Fuzzy search algorithms](https://en.wikipedia.org/wiki/Approximate_string_matching)

---

**Tính năng này giúp người dùng tìm kiếm dễ dàng và nhanh chóng hơn!** 🚀

