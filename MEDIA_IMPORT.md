# Importing Google Photos exports

This project is a static website. The local importer copies supported media
from Google Takeout ZIP archives into a public Google Drive folder and writes
`public/media-library.json`. Build and redeploy the site after each successful
import to publish the updated catalog. The site reads the local catalog and
continues to use its sample media if no imported catalog is present.

This workflow uses Google Takeout and Google Drive APIs, not the Google Photos
API. It does not read the shared-album link or silently access a Photos library.

## One-time setup

1. In Google Takeout, create an export of Google Photos and choose **Add to
   Google Drive**. For recurring updates, use Takeout's scheduled export.
2. Install Google Drive for desktop and make sure the Takeout folder is
   available locally. Configure the folder for offline/mirrored access before
   processing multi-gigabyte ZIPs.
3. In Google Cloud Console, create a project, enable the Google Drive API, and
   create an OAuth client ID of type **Desktop app**. Keep the client secret
   private; do not commit it or send it in chat.
4. Copy `.env.example` to `.env.local`, then fill in the OAuth client ID and
   secret and set `GOOGLE_TAKEOUT_DIR` to the locally synced Takeout folder.
   `.env.local` and the importer's saved OAuth token/state are git-ignored.
5. Ensure the Google account has enough free space for the exported archive and
   the published media. The importer asks before making its Drive output folder
   public. Anyone with the links can access those files.
6. Run `npm run media:import`. The first run opens Google sign-in. Review the
   requested Drive permission and approve only if you intend to use this
   importer.
7. After the import succeeds, run `npm run build` and redeploy the site.

For recurring imports, note that an external OAuth consent app left in
**Testing** can issue refresh tokens that expire after seven days. Reauthorize
when prompted, or configure the consent app for production use if appropriate
for your account and Google Cloud project.

The importer creates its own `Techzilla Media` folder, uploads photos and videos
separately in the generated catalog, and stores its resumable state locally in
`scripts/.local/`. It ignores unsupported files and JSON sidecars. It does not
delete uploaded media when an item disappears from a later export.

## Recurring exports

Keep the importer running with `npm run media:watch` on the computer that syncs
Google Drive. It checks every 30 minutes by default. Once each new archive has
finished syncing, it processes it and updates the local catalog. The website
still needs to be rebuilt and redeployed after the catalog changes.

If you set `DELETE_IMPORTED_TAKEOUT_ARCHIVES=true`, the importer deletes a ZIP
from the configured local folder only after all supported items have uploaded
and the catalog has been written. Use this only when that folder is the synced
Google Drive Takeout folder; deletion will sync back to Drive. Keeping both the
Takeout ZIP and extracted media in Drive requires extra storage.

Google Drive is not a dedicated media CDN. Public links may be subject to
Google download/traffic limits, and this setup should be tested with the
website's expected visitor traffic before relying on it for broad distribution.
