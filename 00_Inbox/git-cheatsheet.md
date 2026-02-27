# Git 操作小抄（最常用）

## 日常 4 步
1) 看状态
```
git status -sb
```
2) 加入暂存
```
git add .
```
3) 提交
```
git commit -m "你的说明"
```
4) 推送
```
git push
```

## 拉取最新（先同步再改）
```
git pull --rebase
```

## 只提交某个文件
```
git add path/to/file
```

## 取消暂存（反悔）
```
git restore --staged path/to/file
```

## 查看提交历史（简洁）
```
git log --oneline --decorate -10
```

## 大文件（Git LFS）
1) 追踪大文件
```
git lfs track "path/to/large/file"
```
2) 添加并提交
```
git add .gitattributes
```
```
git add path/to/large/file
```
```
git commit -m "Track large file with LFS"
```

## 当前分支与远端
```
git remote -v
```
```
git branch -vv
```
