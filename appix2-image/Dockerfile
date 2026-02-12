FROM n8nio/n8n:2.7.4-arm64

USER root

RUN if command -v wget >/dev/null 2>&1; then \
        wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz -O /tmp/ffmpeg.tar.xz; \
    elif command -v curl >/dev/null 2>&1; then \
        curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz -o /tmp/ffmpeg.tar.xz; \
    else \
        echo "No download tool available"; exit 1; \
    fi && \
    cd /tmp && \
    tar xf ffmpeg.tar.xz && \
    cp ffmpeg-*-arm64-static/ffmpeg /usr/local/bin/ && \
    cp ffmpeg-*-arm64-static/ffprobe /usr/local/bin/ && \
    chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    rm -rf /tmp/ffmpeg*

USER node
