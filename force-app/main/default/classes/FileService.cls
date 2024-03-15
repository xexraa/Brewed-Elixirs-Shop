public with sharing class FileService {

    public static void assignImageToProduct(String imageTitle, Id productId) {
        ContentVersion cv = [SELECT Id, ContentDocumentId, VersionDataUrl FROM ContentVersion WHERE Title = :imageTitle LIMIT 1];

        if (cv != null) {
            ContentDocumentLink link = new ContentDocumentLink();
            link.ContentDocumentId = cv.ContentDocumentId;
            link.LinkedEntityId = productId;
            link.ShareType = 'V';
            link.Visibility = 'AllUsers';
            insert link;

            Product2Service.updateProductImageUrl(cv.VersionDataUrl, productId);

            ContentDistribution cd = new ContentDistribution(
                Name = productId,
                ContentVersionId = cv.Id,
                PreferencesAllowViewInBrowser = true
            );
            insert cd;
        }
    }

    public static String getImagesForProduct(Id productId) {
        List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :productId];

        if (!documentLinks.isEmpty()) {
            Set<Id> contentDocumentIds = new Set<Id>();
            for (ContentDocumentLink link : documentLinks) {
                contentDocumentIds.add(link.ContentDocumentId);
            }

            List<ContentVersion> contentVersions = [SELECT VersionDataUrl FROM ContentVersion WHERE ContentDocumentId IN :contentDocumentIds];

            // TODO: Only first img as link right now
            ContentVersion cv = contentVersions[0];
            String versionDataUrl = cv.VersionDataUrl;
            system.debug('Link: ' + versionDataUrl);
            return versionDataUrl;
        } else {
            return null;
        }
    }
}