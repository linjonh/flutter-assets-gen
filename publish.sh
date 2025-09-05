#!/bin/bash
#微软 Azure DevOps PAT 参照:https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate
export VSCE_PAT=$1 
echo $VSCE_PAT
vsce publish