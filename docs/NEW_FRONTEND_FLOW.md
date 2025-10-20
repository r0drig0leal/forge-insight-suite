# New Frontend Flow Implementation

## 🔄 **Updated Frontend Flow**

The frontend now follows a simplified two-step process as requested:

### **Step 1: Get Parcel ID and Start Processing**
```typescript
POST/GET /api/parcel-id-by-address?address=...
```
**Response:**
```json
{
  "parcel_id": "12345-ABC-67890",
  "message": "Processing started"
}
```

### **Step 2: Poll for Processing Status**
```typescript
GET /api/parcel-id-status?parcel_id=12345-ABC-67890
```
**Response:**
```json
{
  "parcel_id": "12345-ABC-67890", 
  "status": "running", // or "completed", "failed", "not_found"
  "message": "Processing property data...",
  "progress": 45 // optional 0-100 percentage
}
```

## 📋 **Status Values**

| Status | Description | Frontend Action |
|--------|-------------|-----------------|
| `running` | Background processing via Redis/main.py | Continue polling every 2 seconds |
| `completed` | All data processed and ready | Auto-trigger property analysis |
| `failed` | Processing failed or error occurred | Stop polling, show error |
| `not_found` | No data found for parcel ID | Stop polling, show not found |

## 🎯 **Complete User Flow**

1. **User selects address** from autocomplete
2. **Frontend calls** `/api/parcel-id-by-address?address=...` 
3. **Backend returns** `parcel_id` immediately and starts Redis processing
4. **Frontend starts polling** `/api/parcel-id-status?parcel_id=...` every 2 seconds
5. **Backend processes** data via `main.py` in background
6. **When status = "completed"** → Frontend auto-triggers property data display
7. **Full dashboard** loads with all property information

## ⚙️ **Technical Implementation**

### **Polling Configuration:**
- **Interval**: 2 seconds (longer than before since backend processing takes time)
- **Max Attempts**: 60 (2 minutes total)
- **Auto-progression**: When `status = "completed"`, automatically calls `onAnalyze(parcel_id)`

### **Error Handling:**
- **Network errors**: Retry polling
- **API timeouts**: Show error after 2 minutes
- **Processing failures**: Show user-friendly error message
- **Graceful degradation**: Fallback to address if all fails

### **UI Feedback:**
- **"Processing Data..."** during polling
- **Progress bar** if backend provides progress percentage
- **"Processing Failed"** on errors
- **"Data Not Found"** when no results

## 🔧 **Backend Integration Points**

### **Required Endpoints:**

1. **`/api/parcel-id-by-address`** (GET/POST)
   - Input: `address` parameter
   - Output: `parcel_id` + start Redis job
   - Action: Immediate response + background processing

2. **`/api/parcel-id-status`** (GET) 
   - Input: `parcel_id` parameter
   - Output: current processing status
   - Action: Check Redis job status

### **Redis Integration:**
- Backend queues processing job when parcel ID requested
- `main.py` processes data in background
- Status endpoint checks Redis job status
- When complete, property data available via existing endpoints

## ✅ **Benefits of New Flow**

- ✅ **Single address submission** - no repeated API calls
- ✅ **Background processing** - user sees immediate feedback
- ✅ **Real-time status** - progress updates via polling
- ✅ **Auto-progression** - seamless flow to final results
- ✅ **Better UX** - clear status messages and feedback
- ✅ **Scalable** - Redis handles long-running processes
- ✅ **Robust** - proper error handling and timeouts