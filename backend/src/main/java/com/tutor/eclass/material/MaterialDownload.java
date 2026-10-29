package com.tutor.eclass.material;

import org.springframework.core.io.Resource;

public record MaterialDownload(
    Resource resource,
    String originalFilename
) {
}