package com.tutor.eclass.material;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateMaterialRequest(

    @NotBlank
    @Size(max = 200)
    String title

) {
}