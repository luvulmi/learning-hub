$ErrorActionPreference = "Stop"

$BucketName = "learning-hub-frontend-454252678226-ap-southeast-2-an"
$DistributionId = "E1U39WVDASVYYC"

aws s3 sync dist/ "s3://$BucketName" --delete
aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
