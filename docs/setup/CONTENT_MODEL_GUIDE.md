# Content Model Guide - Phase Content Type

This guide provides instructions for creating the Phase content type in Strapi CMS.

## Overview

The **Phase** content type represents the six learning phases in the FiftyFifty ToolKit methodology:
1. Discovery
2. Strategy
3. Design
4. Implementation
5. Monitoring & Evaluation
6. Sustainability

## Content Type Structure

### Basic Information
- **Display Name**: Phase
- **API ID (Singular)**: phase
- **API ID (Plural)**: phases
- **Collection Type**: Yes
- **Draft & Publish**: Enabled
- **Internationalization (i18n)**: Enabled

### Fields

| Field Name | Type | Settings | Validation |
|------------|------|----------|------------|
| **title** | Text (Short) | Required, Localized | Max length: 100 |
| **slug** | UID | Required, Target: title | Auto-generated from title |
| **description** | Rich Text | Required, Localized | - |
| **order** | Number (Integer) | Required | Min: 1, Max: 100, Default: 1 |
| **phase_number** | Number (Integer) | Required | Min: 1, Max: 6 |
| **header_video_url** | Text (Short) | Optional | Valid YouTube/Vimeo URL |
| **modules** | Relation | One-to-Many | Target: Module |

## Creating via Admin Panel

### Step 1: Access Content-Type Builder

1. Log in to Strapi admin panel at http://localhost:1337/admin
2. Navigate to **Content-Type Builder** (left sidebar, under PLUGINS)
3. Click **"+ Create new collection type"**

### Step 2: Basic Settings

1. **Display name**: Enter `Phase`
2. Strapi will auto-fill:
   - API ID (Singular): `phase`
   - API ID (Plural): `phases`
3. Click **Continue**

### Step 3: Add Fields

#### Field 1: Title
1. Click **"+ Add another field"**
2. Select **Text**
3. Name: `title`
4. Type: **Short text**
5. Click **Advanced Settings** tab:
   - Check **Required field**
   - Check **Enable localization for this field**
   - Max length: `100`
6. Click **Finish**

#### Field 2: Slug
1. Click **"+ Add another field"**
2. Select **UID**
3. Name: `slug`
4. Attached field: Select `title`
5. Click **Advanced Settings**:
   - Check **Required field**
6. Click **Finish**

#### Field 3: Description
1. Click **"+ Add another field"**
2. Select **Rich text**
3. Name: `description`
4. Click **Advanced Settings**:
   - Check **Required field**
   - Check **Enable localization for this field**
6. Click **Finish**

#### Field 4: Order
1. Click **"+ Add another field"**
2. Select **Number**
3. Name: `order`
4. Number format: **integer**
5. Click **Advanced Settings**:
   - Check **Required field**
   - Minimum value: `1`
   - Maximum value: `100`
   - Default value: `1`
6. Click **Finish**

#### Field 5: Phase Number
1. Click **"+ Add another field"**
2. Select **Number**
3. Name: `phase_number`
4. Number format: **integer**
5. Click **Advanced Settings**:
   - Check **Required field**
   - Minimum value: `1`
   - Maximum value: `6`
6. Click **Finish**

#### Field 6: Header Video URL
1. Click **"+ Add another field"**
2. Select **Text**
3. Name: `header_video_url`
4. Type: **Short text**
5. Click **Advanced Settings**:
   - Leave **Required field** unchecked
   - Max length: `500`
   - RegExp pattern: `^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$`
6. Click **Finish**

#### Field 7: Modules (Relation)
*Note: This field should be created after the Module content type is created*

1. Click **"+ Add another field"**
2. Select **Relation**
3. Right side: Select **Module** (api::module.module)
4. Configure relation:
   - Left: Phase **has many** Modules
   - Right: Module **belongs to** Phase
5. Field name: `modules`
6. Click **Finish**

### Step 4: Enable Internationalization

1. After adding all fields, click **Edit** on the Phase content type
2. In the modal, click **Advanced Settings** tab
3. Check **Enable localization for this Content-Type**
4. Click **Save**

### Step 5: Save and Restart

1. Click **Save** in the top right
2. Strapi will prompt you to restart
3. Click **Restart** or restart manually:
   ```bash
   npm run develop
   ```

## Creating via Schema File (Alternative)

If you prefer to create the content type programmatically:

1. Copy the schema file from: `strapi-cms/src/api/phase/content-types/phase/schema.json`
2. Restart Strapi
3. The content type will be automatically created

## Configuring API Permissions

### For Public Access (Frontend)

1. Go to **Settings** → **Roles** → **Public**
2. Scroll to **Phase** permissions
3. Check the following:
   - ✅ **find** (Get all phases)
   - ✅ **findOne** (Get single phase)
4. Leave unchecked:
   - ❌ create
   - ❌ update
   - ❌ delete
5. Click **Save**

### For Authenticated Users

1. Go to **Settings** → **Roles** → **Authenticated**
2. Configure permissions based on your requirements
3. For content editors, enable all CRUD operations

## Adding Sample Content

### Manual Entry

1. Go to **Content Manager** → **Phase**
2. Click **"+ Create new entry"**
3. Fill in the fields:
   - **Title (English)**: Discovery
   - **Slug**: discovery (auto-generated)
   - **Description**: [Use rich text editor to add formatted content]
   - **Order**: 1
   - **Phase Number**: 1
   - **Header Video URL**: https://www.youtube.com/watch?v=example
4. Click locale switcher (top right) to add Arabic translation:
   - **Title (Arabic)**: الاكتشاف
   - **Description**: [Add Arabic description]
5. Click **Save** and then **Publish**
6. Repeat for all 6 phases

### Using Sample Data

Sample phase data is available in: `strapi-cms/sample-data/phases.json`

To import:
1. Install the import/export plugin or manually create entries
2. Use the sample data as reference for content

## Sample Phase Data

### Phase 1: Discovery
- **Title (EN)**: Discovery
- **Title (AR)**: الاكتشاف
- **Slug**: discovery
- **Order**: 1
- **Phase Number**: 1

### Phase 2: Strategy
- **Title (EN)**: Strategy
- **Title (AR)**: الاستراتيجية
- **Slug**: strategy
- **Order**: 2
- **Phase Number**: 2

### Phase 3: Design
- **Title (EN)**: Design
- **Title (AR)**: التصميم
- **Slug**: design
- **Order**: 3
- **Phase Number**: 3

### Phase 4: Implementation
- **Title (EN)**: Implementation
- **Title (AR)**: التنفيذ
- **Slug**: implementation
- **Order**: 4
- **Phase Number**: 4

### Phase 5: Monitoring & Evaluation
- **Title (EN)**: Monitoring & Evaluation
- **Title (AR)**: المراقبة والتقييم
- **Slug**: monitoring-evaluation
- **Order**: 5
- **Phase Number**: 5

### Phase 6: Sustainability
- **Title (EN)**: Sustainability
- **Title (AR)**: الاستدامة
- **Slug**: sustainability
- **Order**: 6
- **Phase Number**: 6

## Testing the API

### Get All Phases

```bash
# Without authentication (public access)
curl http://localhost:1337/api/phases?populate=*

# With API token
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  http://localhost:1337/api/phases?populate=*
```

### Get Single Phase

```bash
# By ID
curl http://localhost:1337/api/phases/1?populate=*

# By slug (requires custom endpoint or filter)
curl http://localhost:1337/api/phases?filters[slug][$eq]=discovery&populate=*
```

### Get Phase with Modules

```bash
curl http://localhost:1337/api/phases/1?populate[modules][populate]=*
```

### Get Localized Content

```bash
# Arabic
curl http://localhost:1337/api/phases?locale=ar

# English (default)
curl http://localhost:1337/api/phases?locale=en
```

## Integration with Frontend

TypeScript types are available in `lib/types/phase.ts`.

Example usage:
```typescript
import { PhasesResponse } from '@/lib/types/phase';

async function getPhases(locale: string): Promise<PhasesResponse> {
  const res = await fetch(
    `${process.env.CMS_BASE_URL}/api/phases?locale=${locale}&sort=order:asc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch phases');
  }
  
  return res.json();
}
```

## Troubleshooting

### Content Type Not Appearing

1. Check that you restarted Strapi after creating the content type
2. Clear browser cache
3. Check Strapi logs for errors: `docker-compose logs strapi`

### API Returns Empty Data

1. Ensure content is **Published** (not just saved as draft)
2. Check API permissions for Public role
3. Verify API token has correct permissions

### Localization Not Working

1. Ensure i18n plugin is installed (included by default)
2. Check that "Enable localization" is checked for the content type
3. Verify individual fields have "Enable localization" checked
4. Use `?locale=ar` or `?locale=en` in API requests

### Relations Not Populating

1. Use `?populate=*` to populate all relations
2. For nested relations: `?populate[modules][populate]=*`
3. Check that related content type (Module) exists

## Next Steps

After creating the Phase content type:

1. ✅ Create Module content type (US2.3)
2. ✅ Create Tool content type (US2.4)
3. ✅ Set up relations between Phase → Module → Tool
4. ✅ Add sample content for all phases
5. ✅ Test API endpoints
6. ✅ Integrate with frontend

## Related Documentation

- [CMS Setup Guide](./CMS_SETUP_GUIDE.md)
- [Story US2.2](../stories/US2.2.md)
- [Strapi Content-Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
- [Strapi i18n Plugin](https://docs.strapi.io/user-docs/plugins/strapi-plugins#internationalization-plugin)

