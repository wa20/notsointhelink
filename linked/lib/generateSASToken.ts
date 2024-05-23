import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  BlobSASPermissions,
} from "@azure/storage-blob";


export const containerName = "posts";

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;


if (!accountName || !accountKey) {
  throw new Error("Azure storage account name or key is missing");
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
);


async function generateSASToken() { 
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const permissions = new BlobSASPermissions();
    permissions.write = true;
    permissions.read = true;
    permissions.create = true;

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60);

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: containerClient.containerName,
            permissions: permissions,
            expiresOn: expiryDate,
        },
        sharedKeyCredential
    ).toString();

    return sasToken;
}

export default generateSASToken;
