import os
import boto3
from botocore.handlers import disable_signing
import json

resource = boto3.resource('s3')
resource.meta.client.meta.events.register('choose-signer.s3.*', disable_signing)

bucket = resource.Bucket('uga-coast-forecasting')

list = []
code = 'metadata.json'
for item in bucket.objects.all():
    key = item.key
    if (code in key):
        list.append(key)

json_object = json.dumps(list, indent=4)
with open("meta.json", "w") as outfile:
    outfile.write(json_object)