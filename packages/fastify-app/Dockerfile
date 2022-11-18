# FROM node:18-bullseye-slim as node
FROM public.ecr.aws/docker/library/node:18-slim as node
ENV PNPM_VERSION=7.16.1
RUN npm uninstall --global yarn && \
    corepack disable && \
    corepack enable pnpm && \
    corepack prepare pnpm@${PNPM_VERSION} --activate
COPY --chown=node:node . /app
USER node
WORKDIR /app
RUN find -type f -regextype sed -regex ".*\.\(test\|spec\|stories\)\.\(ts\|tsx\)" -delete && \
    find -type f -regextype sed -regex ".*\.snap" -delete
RUN pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm prisma generate && \
    pnpm build && \
    cp "node_modules/.pnpm/prisma@4.6.1/node_modules/prisma/libquery_engine-debian-openssl-1.1.x.so.node" dist/ && \
    pnpm install -P --frozen-lockfile --ignore-scripts
    # pnpm install --production --ignore-scripts && \
    # pnpm cache clean

# FROM node:18-bullseye-slim as base
FROM public.ecr.aws/docker/library/node:18-slim as base
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.5.0 /lambda-adapter /opt/extensions/lambda-adapter

# ENV TINI_VERSION 0.19.0-1
# ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/bin/tini
# RUN chmod +x /usr/bin/tini
# RUN apt-get update && \
#     apt-get -qq install -y --no-install-recommends \
#     tini=${TINI_VERSION} && \
#     rm -rf /var/lib/apt/lists/*
EXPOSE 3000

COPY --from=node --chown=node:node /app/dist/ /app/
COPY --from=node --chown=node:node /app/prisma/schema.prisma /app/

# USER node
ENV STAGE=PRODUCTION
ENV PORT=3000
WORKDIR /app

# ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "app.js"]
