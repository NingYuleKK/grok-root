#!/usr/bin/env bash
set -euo pipefail

# Incrementally mirror all accessible GitHub repos (personal + orgs) locally.
# Default target: /Users/kk/Desktop/LitchCodex/github-mirror

BASE_DIR="/Users/kk/Desktop/LitchCodex/github-mirror"
ACCOUNT=""
INCLUDE_ORGS="true"
SYNC_WIKIS="true"
REPO_LIMIT="1000"

usage() {
  cat <<'EOF'
Usage:
  github-mirror-sync.sh [options]

Options:
  --base <path>         Mirror base directory (default: /Users/kk/Desktop/LitchCodex/github-mirror)
  --account <login>     GitHub login to mirror (default: current gh auth user)
  --include-orgs <bool> Mirror repos from orgs you belong to: true/false (default: true)
  --sync-wikis <bool>   Try syncing repository wiki repos: true/false (default: true)
  --repo-limit <n>      Max repos fetched per owner/org (default: 1000)
  -h, --help            Show help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base)
      BASE_DIR="$2"
      shift 2
      ;;
    --account)
      ACCOUNT="$2"
      shift 2
      ;;
    --include-orgs)
      INCLUDE_ORGS="$2"
      shift 2
      ;;
    --sync-wikis)
      SYNC_WIKIS="$2"
      shift 2
      ;;
    --repo-limit)
      REPO_LIMIT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI not found in PATH." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

if [[ -z "$ACCOUNT" ]]; then
  ACCOUNT="$(gh api user --jq '.login')"
fi

mkdir -p "$BASE_DIR"
mkdir -p "$BASE_DIR/$ACCOUNT/repos" "$BASE_DIR/$ACCOUNT/wikis"
mkdir -p "$BASE_DIR/logs"

RUN_TS="$(date '+%Y-%m-%d %H:%M:%S')"
echo "[$RUN_TS] Sync start | account=$ACCOUNT | base=$BASE_DIR"

repo_cloned=0
repo_updated=0
wiki_cloned=0
wiki_updated=0
repo_failed=0
repo_total=0

sync_owner_repos() {
  local owner="$1"
  local target_root="$2"
  local repo_list="$3"

  gh repo list "$owner" \
    --limit "$REPO_LIMIT" \
    --json nameWithOwner,isPrivate,isFork,isArchived,hasWikiEnabled,url \
    --jq '.[] | [.nameWithOwner, (.isPrivate|tostring), (.isFork|tostring), (.isArchived|tostring), (.hasWikiEnabled|tostring), .url] | @tsv' \
    > "$repo_list"

  if [[ ! -s "$repo_list" ]]; then
    echo "No repos found for $owner"
    return 0
  fi

  while IFS=$'\t' read -r full_name is_private is_fork is_archived has_wiki html_url; do
    [[ -z "$full_name" ]] && continue
    local repo_name="${full_name#*/}"
    local repo_dir="$target_root/repos/$repo_name"
    local git_url="https://github.com/${full_name}.git"
    repo_total=$((repo_total + 1))

    if [[ -d "$repo_dir/.git" ]]; then
      if git -C "$repo_dir" pull --ff-only >/dev/null 2>&1; then
        repo_updated=$((repo_updated + 1))
      else
        repo_failed=$((repo_failed + 1))
        echo "WARN repo update failed: $full_name"
      fi
    else
      if git clone "$git_url" "$repo_dir" >/dev/null 2>&1; then
        repo_cloned=$((repo_cloned + 1))
      else
        repo_failed=$((repo_failed + 1))
        echo "WARN repo clone failed: $full_name"
        continue
      fi
    fi

    if [[ "$SYNC_WIKIS" == "true" && "$has_wiki" == "true" ]]; then
      local wiki_dir="$target_root/wikis/${repo_name}.wiki"
      local wiki_url="https://github.com/${full_name}.wiki.git"
      if [[ -d "$wiki_dir/.git" ]]; then
        if git -C "$wiki_dir" pull --ff-only >/dev/null 2>&1; then
          wiki_updated=$((wiki_updated + 1))
        fi
      else
        if git clone "$wiki_url" "$wiki_dir" >/dev/null 2>&1; then
          wiki_cloned=$((wiki_cloned + 1))
        fi
      fi
    fi
  done < "$repo_list"
}

ACCOUNT_ROOT="$BASE_DIR/$ACCOUNT"
PERSONAL_LIST="$ACCOUNT_ROOT/repo-list.tsv"
sync_owner_repos "$ACCOUNT" "$ACCOUNT_ROOT" "$PERSONAL_LIST"

org_total=0
if [[ "$INCLUDE_ORGS" == "true" ]]; then
  ORG_ROOT="$BASE_DIR/orgs"
  mkdir -p "$ORG_ROOT"
  ORG_LIST="$ORG_ROOT/org-list.txt"
  gh api user/orgs --jq '.[].login' > "$ORG_LIST" || true
  if [[ -s "$ORG_LIST" ]]; then
    while IFS= read -r org; do
      [[ -z "$org" ]] && continue
      org_total=$((org_total + 1))
      local_root="$ORG_ROOT/$org"
      mkdir -p "$local_root/repos" "$local_root/wikis"
      org_repo_list="$local_root/repo-list.tsv"
      sync_owner_repos "$org" "$local_root" "$org_repo_list"
    done < "$ORG_LIST"
  fi
fi

END_TS="$(date '+%Y-%m-%d %H:%M:%S')"
echo "[$END_TS] Sync done"
echo "SUMMARY repos_total=$repo_total cloned=$repo_cloned updated=$repo_updated failed=$repo_failed wikis_cloned=$wiki_cloned wikis_updated=$wiki_updated orgs=$org_total"
