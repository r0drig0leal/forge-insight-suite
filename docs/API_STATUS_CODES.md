# API Status Codes Documentation

## Parcel ID Processing Status

When calling the `/api/parcel-id-by-address` endpoint, the backend returns a status field indicating the current state of the parcel ID processing task.

### Status Values

| Status | Description | Action Required |
|--------|-------------|-----------------|
| `completed` | Parcel ID found and returned | Ready to proceed with property data retrieval |
| `running` | Parcel ID is being processed (task sent to Celery) | Continue polling until completion |
| `failed` | Error occurred while processing or queuing the task | Handle error, possibly retry or fallback |
| `not_found` | Explicit response when no result is found | Handle as no data available |
| `queued` | Task is queued and waiting to be processed | Continue polling (currently returns "running" when queued) |
| `pending` | Initial status before processing begins (optional) | Continue polling until status changes |

### Response Format

```json
{
  "status": "completed",
  "parcel_id": "12345-ABC-67890",
  "message": "Parcel ID successfully found and processed"
}
```

### Frontend Polling Strategy

The frontend implements a polling mechanism that:

1. **Initial Request**: Call `/api/parcel-id-by-address?address={encoded_address}`
2. **Status Check**: Evaluate the returned status
3. **Polling Logic**:
   - `pending`, `queued`, `running` → Continue polling every 1 second
   - `completed` → Stop polling, use parcel_id for property data retrieval
   - `failed`, `not_found` → Stop polling, handle error appropriately

### Implementation Notes

- **Maximum Attempts**: Frontend polls for up to 30 seconds (30 attempts)
- **Polling Interval**: 1 second between requests
- **Auto-progression**: When status is `completed`, automatically trigger property data analysis
- **Fallback**: On timeout or error, use the original address as fallback identifier

### Celery Task Integration

The backend utilizes Celery for asynchronous processing:

- **Task Queuing**: Address processing tasks are queued in Celery
- **Status Tracking**: Task status is monitored and reflected in API responses
- **Error Handling**: Failed tasks return appropriate error status and messages
- **Scalability**: Multiple workers can process parcel ID lookup tasks concurrently

### Error Handling

| Error Scenario | Status | Frontend Action |
|----------------|--------|-----------------|
| API timeout | `failed` | Use address as fallback, show error message |
| Network error | `failed` | Retry or use address as fallback |
| Invalid address | `not_found` | Show user-friendly error message |
| Celery worker down | `failed` | Handle gracefully, provide fallback option |
| Database unavailable | `failed` | Show system error, suggest retry |

### Usage Examples

#### Successful Processing Flow
```
1. POST → status: "pending" → Continue polling
2. GET → status: "queued" → Continue polling  
3. GET → status: "running" → Continue polling
4. GET → status: "completed", parcel_id: "ABC123" → Proceed with analysis
```

#### Error Flow
```
1. POST → status: "pending" → Continue polling
2. GET → status: "running" → Continue polling
3. GET → status: "failed", message: "Database error" → Handle error
```

#### Not Found Flow
```
1. POST → status: "pending" → Continue polling
2. GET → status: "running" → Continue polling
3. GET → status: "not_found", message: "Address not in database" → Handle gracefully
```