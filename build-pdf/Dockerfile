# Playwright's own image: Chromium and its system libraries are already here,
# and the tag is pinned to the Playwright version in package.json so the
# browser and the driver can't drift apart.
FROM mcr.microsoft.com/playwright:v1.56.0-noble

WORKDIR /app

# Fonts Chromium needs for the languages the app writes in — without these a
# Chinese or Arabic resume prints as boxes.
USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     fonts-noto-core fonts-noto-cjk fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
# The browser is in the image already, so skip the postinstall that fetches it.
RUN npm install --omit=dev --ignore-scripts

COPY server.js ./

ENV PORT=4000
EXPOSE 4000
USER pwuser

CMD ["node", "server.js"]
