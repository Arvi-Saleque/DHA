# ImageUploader Component

A reusable React component for uploading images to Cloudinary with preview and progress indication.

## Location

`src/components/common/ImageUploader.tsx`

## Usage

```tsx
import ImageUploader from "@/components/common/ImageUploader";

function YourComponent() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <ImageUploader
      label="Upload Photo"
      value={imageUrl}
      onChange={setImageUrl}
      folder="your-folder-name"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `"Upload Image"` | Label text displayed above the uploader |
| `value` | `string` | `""` | Current image URL (controlled component) |
| `onChange` | `(url: string) => void` | **required** | Callback when image is uploaded or removed |
| `folder` | `string` | `"dha-uploads"` | Cloudinary folder name for organization |
| `accept` | `string` | `"image/*"` | File input accept attribute |
| `maxSizeMB` | `number` | `5` | Maximum file size in megabytes |
| `preview` | `boolean` | `true` | Show image preview when uploaded |

## Examples

### Basic Usage

```tsx
<ImageUploader
  label="Profile Photo"
  value={formData.profileUrl}
  onChange={(url) => setFormData({ ...formData, profileUrl: url })}
/>
```

### With Custom Folder

```tsx
<ImageUploader
  label="Event Banner"
  value={eventImage}
  onChange={setEventImage}
  folder="events"
/>
```

### Without Preview

```tsx
<ImageUploader
  label="Signature"
  value={signature}
  onChange={setSignature}
  folder="signatures"
  preview={false}
/>
```

### Custom File Size

```tsx
<ImageUploader
  label="High Resolution Image"
  value={image}
  onChange={setImage}
  folder="high-res"
  maxSizeMB={10}
/>
```

## Features

- ✅ Automatic upload to Cloudinary
- ✅ Image preview with remove button
- ✅ Loading state during upload
- ✅ File size validation
- ✅ Error handling and display
- ✅ Accessible file input
- ✅ Responsive design

## Folder Organization

Recommended folder names by content type:

- `gallery` - Gallery images
- `header-slider` - Homepage slider images
- `news-events` - News and event images
- `absences` - Attendance sheets
- `chairman` - Chairman photos/signatures
- `homepage-about` - About section images
- `faculty` - Teacher/staff photos
- `facilities` - Campus/facility photos

## Styling

The component uses:
- Tailwind CSS utility classes
- shadcn/ui Button and Label components
- lucide-react icons

## Error Handling

The component handles:
- File size validation
- Upload failures
- Network errors
- Invalid file types

Errors are displayed below the upload button in red text.

## States

1. **Empty**: No image uploaded, shows upload button
2. **Uploading**: Shows loading spinner and "Uploading..." text
3. **Uploaded**: Shows preview image with remove button

## Notes

- Requires Cloudinary credentials in environment variables
- Uses `/api/upload` endpoint for uploads
- Returns Cloudinary secure URL
- Automatically optimizes images via Cloudinary
