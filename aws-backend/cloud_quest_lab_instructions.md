# AWS Cloud Quest Machine Learning - Payment Document Processing Setup Guide

This guide walks you through connecting your **AWS Cloud Quest: Machine Learning** lab resources (S3 Bucket & Lambda function) to this dashboard web app.

---

## Step 1: Deploy Lambda Function Code

1. Open your **AWS Cloud Quest Console** tab and navigate to **AWS Lambda**.
2. Select your pre-created Lambda function (e.g., `CloudQuestPayComprehendFunction`).
3. Open `lambda_function.py` in the code editor.
4. Replace the existing default code with the contents of [`aws-backend/lambda_function.py`](file:///c:/Users/CT0514/OneDrive%20-%20Suomen%20Asiakastieto%20Oy/sandbox/workspaces/comprehand/aws-backend/lambda_function.py).
5. Click **Deploy** in the top right corner.

---

## Step 2: Ensure IAM Permissions for Textract & Comprehend

1. In your Lambda configuration, click on the **Configuration** tab -> **Permissions**.
2. Click on the **Role Name** link to open IAM.
3. Verify or attach the IAM policy found in [`aws-backend/iam_policy.json`](file:///c:/Users/CT0514/OneDrive%20-%20Suomen%20Asiakastieto%20Oy/sandbox/workspaces/comprehand/aws-backend/iam_policy.json) allowing:
   - `textract:AnalyzeExpense`
   - `comprehend:DetectEntities` & `comprehend:DetectKeyPhrases`
   - `s3:GetObject` & `s3:PutObject`

---

## Step 3: Configure S3 Event Notification Trigger

1. Navigate to **Amazon S3** in your AWS console.
2. Select your Cloud Quest S3 Bucket (e.g., `cloudquest-ml-bucket-0514`).
3. Go to the **Properties** tab and scroll down to **Event Notifications**.
4. Click **Create event notification**:
   - **Event Name**: `TriggerLambdaOnUpload`
   - **Event Types**: Select `All object create events` (`s3:ObjectCreated:*`)
   - **Destination**: Select `Lambda Function` -> Choose your Cloud Quest Lambda function.
5. Click **Save changes**.

---

## Step 4: Add S3 Bucket CORS Rules for Web Uploads

1. In your S3 Bucket, go to the **Permissions** tab.
2. Scroll to **Cross-origin resource sharing (CORS)** and click **Edit**.
3. Paste the contents from [`aws-backend/s3_cors_policy.json`](file:///c:/Users/CT0514/OneDrive%20-%20Suomen%20Asiakastieto%20Oy/sandbox/workspaces/comprehand/aws-backend/s3_cors_policy.json).
4. Click **Save changes**.

---

## Step 5: Connect App Dashboard

1. Launch your local web application dashboard.
2. Click **AWS Config** in the top navigation header.
3. Enter your Cloud Quest **S3 Bucket Name** and **AWS Region** (e.g., `us-east-1`).
4. You're ready! Upload your PDF, PNG, JPG, or DOC payment receipts directly to analyze expense insights & Amazon Comprehend entities.
