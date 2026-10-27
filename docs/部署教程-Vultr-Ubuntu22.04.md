# 小白级部署教程：Vultr + Ubuntu 22.04 部署本项目

本教程适合完全零基础的小白，带你一步步把「深圳市金泰鸿包装制品有限公司外贸官网」部署到 Vultr 云服务器上。

## 目录

- [1. 准备工作](#1-准备工作)
- [2. 在 Vultr 创建服务器](#2-在-vultr-创建服务器)
- [3. 连接服务器](#3-连接服务器)
- [tag: 4. 服务器基础配置](#4-服务器基础配置)
- [5. 安装运行环境](#5-安装运行环境)
- [6. 上传项目代码](#6-上传项目代码)
- [7. 安装依赖并构建](#7-安装依赖并构建)
- [8. 配置 Nginx 静态托管](#8-配置-nginx-静态托管)
- [9. 配置域名和 HTTPS (可选但推荐](#9-配置域名和-https-可可选但推荐)
- [10. 日常维护](#10-日常维护)
- [11. 常见问题排查](#11-常见问题排查)
- [12. 快速检查清单](#12-快速检查清单)

## 1. 准备工作

在开始之前，你需要准备以下东西：

| 项目 | 说明 | 是否必需 |
|---|---|---|
| [Vultr 账号](https://www.vultr.com/) | 云服务器提供商 | 是 |
| [SSH 工具](#3-连接服务器) | 用来连接服务器（Windows 推荐用 Tabby、Termius、PuTTY，Mac/Linux 自带终端即可） | 是 |
| [域名](https://www.namesilo.com/、https://www.godaddy.com/) | 网站访问地址（不买域名也可以用 IP 访问） | 否（但推荐） |
| [本地项目代码](../) | 当前文件夹中的项目代码 | 是 |

## 2. 在 Vultr 创建服务器

### 步骤 1：登录 Vultr
1. 打开 [vultr.com](https://www.vultr.com/) 并登录账号
2. 点击右上角的 `+ Deploy` -> `Deploy New Server`

### 步骤 2：选择服务器类型
- `Choose Server` 选择 `Cloud Compute - Shared CPU`

### 步骤 3：选择服务器位置
选择离你的目标客户最近的地区（例如：`Singapore`、`Tokyo`、`London`、`Los Angeles` 等）

### 步骤 4：选择操作系统
在 `Operating System` 中选择 `Ubuntu 22.04 LTS x64`

### 步骤 5：选择服务器配置
对于本项目（纯静态网站），推荐配置：
| 配置 | 建议 | 说明 |
|---|---|---|
| `$5/月` | 足够用 | 最基础配置即可，1GB 内存 + 1CPU |
| `$6/月` 或以上 | 更流畅 | 如果访问量较大可选更高配置 |

### 步骤 6：其他设置（可选）
- `Server Hostname`：可以填 `jintaihong-web`
- `SSH Keys`：如果之前配置过可以选，不配置也没问题，后续用密码登录

### 步骤 7：部署
点击底部 `Deploy Now`，等待几分钟，服务器状态变为 `Running` 即可。

部署成功后，在 `Instances` 页面可以看到服务器的 **IP 地址**，记下来（非常重要）。

## 3. 连接服务器

### Windows（使用终端）
1. 按 `Win + X`，选择 `终端（管理员）` 或 `Windows Terminal`
2. 输入以下命令（把 `YOUR_SERVER_IP` 换成你的服务器 IP）：

```bash
ssh root@YOUR_SERVER_IP
```

3. 第一次连接会提示 `Are you sure you want to continue connecting (yes/no/[fingerprint])?`，输入 `yes` 回车
4. 输入服务器密码（输入时不会显示，直接输完回车即可）

### Mac/Linux
直接打开终端，使用同样的 `ssh root@YOUR_SERVER_IP` 命令即可。

## 4. 服务器基础配置

连接成功后，先更新系统并做基础安全配置。

### 更新系统软件包
```bash
apt update && apt upgrade -y
```

### 设置时区（可选，设成上海时间）
```bash
timedatectl set-timezone Asia/Shanghai
timedatectl status
```

### 配置防火墙（UFW）
只开放必要的端口：SSH(22)、HTTP(80)、HTTPS(443)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

输入 `y` 确认。查看状态：
```bash
ufw status
```

## 5. 安装运行环境

### 安装 Nginx
```bash
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

测试：在浏览器访问 `http://YOUR_SERVER_IP`，如果看到 Nginx 默认欢迎页面，说明安装成功。

### 安装 Node.js（推荐用 NodeSource）
本项目需要 Node.js 来构建，推荐安装 LTS 版本（v20）。

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

验证安装：
```bash
node -v
npm -v
```

应该显示 `v20.x.x` 和 `10.x.x` 之类的版本号。

### 安装 Git
```bash
apt install git -y
git --version
```

## 6. 上传项目代码

有两种方式，选其中一种即可。

### 方式 A：用 Git（推荐）
如果你的代码已经上传到 GitHub、GitLab、Gitee 等仓库：

```bash
cd /var/www
git clone https://你的仓库地址.git jintaihong
```

把 `https://你的仓库地址.git` 换成实际的仓库地址，项目会克隆到 `/var/www/jintaihong`。

### 方式 B：用 SFTP 上传（本地直接上传）
如果代码还没上传到仓库，可以用 SFTP 工具上传：

1. 下载 [WinSCP](https://winscp.net/)（Windows）或 [FileZilla](https://filezilla-project.org/)
2. 连接方式：`SFTP`，主机填服务器 IP，端口 `22`，用户名 `root`，密码填服务器密码
3. 连接后，在远程端进入 `/var/www/`
4. 在本地选择整个项目文件夹，上传到 `/var/www/jintaihong/`（如果文件夹不存在先创建）

> 注意：上传时不要上传 `node_modules` 和 `dist` 文件夹，太大且没必要。到服务器上再安装和构建。

## 7. 安装依赖并构建

进入项目目录：
```bash
cd /var/www/jintaihong
```

安装依赖：
```bash
npm install
```

这一步可能需要几分钟，耐心等待即可。

构建项目（生成静态文件）：
```bash
npm run build
```

构建成功后，会生成 `dist/` 文件夹，里面就是要部署的静态网页文件。

检查是否生成成功：
```bash
ls -la dist/
```

应该能看到 `index.html` 等文件。

## 8. 配置 Nginx 静态托管

### 创建站点配置文件
```bash
nano /etc/nginx/sites-available/jintaihong
```

把下面的内容粘贴进去（把 `YOUR_SERVER_IP` 或 `yourdomain.com` 按实际情况替换）：

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;  # 如果有域名就换成 yourdomain.com www.yourdomain.com

    root /var/www/jintaihong/dist;
    index index.html;

    # 支持 React Router 的路由刷新（SPA 必需）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存（可选但能加快加载）
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

按 `Ctrl+X`，然后 `Y`，再 `Enter` 保存。

### 启用站点配置
创建软链接：
```bash
ln -s /etc/nginx/sites-available/jintaihong /etc/nginx/sites-enabled/
```

删除默认站点（可选，避免冲突）：
```bash
rm /etc/nginx/sites-enabled/default
```

### 测试并重启 Nginx
测试配置文件是否有语法错误：
```bash
nginx -t
```

如果显示 `syntax is ok` 和 `test is successful`，说明没问题。

重启 Nginx：
```bash
systemctl reload nginx
```

### 测试访问
现在打开浏览器，访问：
- `http://YOUR_SERVER_IP`（如果没用域名）
- `http://yourdomain.com`（如果用了域名）

应该能看到网站首页了。

## 9. 配置域名和 HTTPS（可选但推荐）

如果你买了域名，按以下步骤配置。

### 域名解析
去你的域名注册商（Namesilo/Godaddy/阿里云等）的 DNS 管理页面，添加两条 A 记录：

| 类型 | 主机记录 | 记录值 |
|---|---|---|
| A | @ | 你的服务器 IP |
| A | www | 你的服务器 IP |

解析生效一般需要几分钟到几十分钟。

### 安装 Certbot（免费 SSL 证书）
```bash
apt install certbot python3-certbot-nginx -y
```

### 自动配置 HTTPS
把 `yourdomain.com` 换成你的真实域名：
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

按照提示操作：
1. 输入邮箱（用于证书到期提醒）
2. 同意服务条款（输入 `Y`）
3. 是否分享邮箱（一般选 `N`）
4. 询问是否重定向 HTTP 到 HTTPS，推荐选 `2`（自动重定向）

配置成功后，访问 `https://yourdomain.com` 就会有小锁标志了。

证书会自动续期，Certbot 已经帮你配置好了定时任务。

## 10. 日常维护

以后更新网站只需要这几步。

### 更新代码（用 Git 的情况）
```bash
cd /var/www/jintaihong
git pull
npm install  # 如果 package.json 有变化才需要
npm run build
systemctl reload nginx
```

### 更新代码（用 SFTP 上传的情况）
用 WinSCP 把本地修改后的文件上传到服务器，覆盖对应文件。上传完成后在服务器上重新构建：

```bash
cd /var/www/jintaihong
npm run build
systemctl reload nginx
```

### 查看 Nginx 日志
如果网站出问题可以查看日志排查：
```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

按 `Ctrl+C` 退出日志查看。

### 重启相关服务
```bash
systemSystem reload nginx
# 或者
systemctl restart nginx
```

## 11. 常见问题排查

| 问�问题 | 原因 | 解决方案 |
|---|---|---|
| 浏览器访问 IP 显示 Nginx 默认页面 | 还没删除 default 配置或配置文件没生效 | 检查 `sites-enabled`，删除 `default`，重启 Nginx |
| 刷新页面出现 404 | React Router 是单页应用，需要配置 `try_files` | 检查 NginX 配置中的 `try_files $uri $uri/ /index.html` 是否存在 |
| 样式错乱、图片不显示 | 静态文件路径错误或构建失败 | 确认 `dist/` 中有 `assets/` 文件夹，重新 `npm run build` |
| `npm install` 很慢或报错 | 网络问题 | 可以换源：`npm config set registry https://registry.npmmirror.com` |
| 无法 SSH 连接 | 防火墙或 IP 错误 | 检查 Vultr 控制台 IP，确认 UFW 放行了 22 端口 |
| HTTPS 配置失败 | 域名还没解析成功或 80 端口没开放 | 等域名解析生效（ping yourdomain.com 看 IP 是否正确），再运行 Certbot |

## 12. 快速检查清单

部署完成后，按顺序检查以下项：

- [ ] 服务器能正常 SSH 连接
- [ ] Nginx 正在运行（`systemctl status nginx` 显示 `active (running)`）
- [ ] 项目已上传到 `/var/www/jintaihong`
- [ ] `dist/` 文件夹存在且有 `index.html`
- [ ] Nginx 配置文件语法正确（`nginx -t`）
- [ ] 浏览器能通过 IP 或域名正常访问首页
- [ ] 导航菜单、图片、按钮都能正常显示
- [ ] 刷新任意页面都不会出现 404
- [ ] 如果配置了域名，HTTPS 访问正常且有小锁
- [ ] 防火墙已配置且只开放必要端口

**恭喜！** 如果以上都检查通过，网站就已经成功部署到 Vultr 云服务器上了。
