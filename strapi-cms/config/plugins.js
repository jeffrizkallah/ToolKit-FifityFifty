/**
 * Strapi Plugins Configuration
 * 
 * Configure third-party and built-in Strapi plugins.
 */

module.exports = ({ env }) => ({
  // Upload Plugin Configuration
  // Supports multiple providers: aws-s3, cloudinary, local (default)
  upload: {
    config: {
      // OPTION 1: AWS S3 (Recommended for Production)
      // Uncomment and configure when using AWS S3
      /*
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        region: env('AWS_REGION', 'eu-central-1'),
        params: {
          Bucket: env('AWS_BUCKET_NAME', 'fiftyfifty-resources'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      */

      // OPTION 2: Cloudinary
      // Uncomment and configure when using Cloudinary
      /*
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_CLOUD_NAME'),
        api_key: env('CLOUDINARY_API_KEY'),
        api_secret: env('CLOUDINARY_API_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
      */

      // OPTION 3: Local Storage (Default - Development Only)
      // Files are stored in strapi-cms/public/uploads
      // This is the default behavior if no provider is specified
      // No configuration needed for local storage
      
      // File size limits (in bytes)
      sizeLimit: 10 * 1024 * 1024, // 10 MB max file size
    },
  },

  // Internationalization Plugin (i18n)
  // Already installed by default in Strapi v4
  i18n: {
    enabled: true,
    config: {
      locales: ['en', 'ar'], // Supported locales
    },
  },

  // Users & Permissions Plugin
  // Built-in authentication and authorization
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '7d', // JWT token expiration
      },
    },
  },
});

