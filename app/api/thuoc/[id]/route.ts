import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy chi tiết thuốc + tăng lượt xem
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // SỬA: Await params trước khi sử dụng
        const resolvedParams = await params;
        console.log('API called with ID:', resolvedParams.id);

        const id = parseInt(resolvedParams.id)

        if (isNaN(id)) {
            console.log('Invalid ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        console.log('Searching for thuoc with ID:', id);

        // KIỂM TRA THUỐC CÓ TỒN TẠI TRƯỚC
        const thuoc = await prisma.thuoc.findUnique({
            where: { id },
            include: {
                danhMuc: {
                    select: {
                        id: true,
                        tenDanhMuc: true,
                        icon: true,
                        mauSac: true
                    }
                }
            }
        })

        if (!thuoc) {
            console.log('Thuoc not found for ID:', id);
            return NextResponse.json(
                { error: 'Không tìm thấy thuốc' },
                { status: 404 }
            )
        }

        console.log('Found thuoc:', thuoc.tenThuoc);

        // SỬA: Sử dụng manual increment thay vì Prisma increment
        try {
            const currentViews = thuoc.luotXem || 0;
            await prisma.thuoc.update({
                where: { id },
                data: {
                    luotXem: currentViews + 1
                }
            });
            console.log('View count updated successfully');

            // Cập nhật object với view count mới
            thuoc.luotXem = currentViews + 1;
        } catch (updateError) {
            console.error('Failed to update view count:', updateError);
            // Không return error, tiếp tục trả về thuốc
        }



        return NextResponse.json({
            thuoc,
        })

    } catch (error) {
        console.error('Error fetching thuoc:', error);
        console.error('Error message:', (error as Error).message);
        console.error('Error stack:', (error as Error).stack);

        return NextResponse.json(
            { error: 'Lỗi khi tải thông tin thuốc: ' + (error as Error).message },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật thuốc
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // SỬA: Await params
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id)
        const data = await request.json()

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        // Check if thuoc exists
        const existingThuoc = await prisma.thuoc.findUnique({
            where: { id }
        })

        if (!existingThuoc) {
            return NextResponse.json(
                { error: 'Không tìm thấy thuốc' },
                { status: 404 }
            )
        }

        // Validate if updating required fields
        if (data.gia && data.gia <= 0) {
            return NextResponse.json(
                { error: 'Giá phải lớn hơn 0' },
                { status: 400 }
            )
        }

        if (data.soLuong !== undefined && data.soLuong < 0) {
            return NextResponse.json(
                { error: 'Số lượng không được âm' },
                { status: 400 }
            )
        }

        // Check if danhMuc exists (if updating)
        if (data.danhMucId) {
            const danhMuc = await prisma.danhMuc.findUnique({
                where: { id: parseInt(data.danhMucId) }
            })

            if (!danhMuc) {
                return NextResponse.json(
                    { error: 'Danh mục không tồn tại' },
                    { status: 400 }
                )
            }
        }

        // Check duplicate name (exclude current thuoc)
        if (data.tenThuoc) {
            const duplicateThuoc = await prisma.thuoc.findFirst({
                where: {
                    tenThuoc: {
                        equals: data.tenThuoc,
                        mode: 'insensitive'
                    },
                    NOT: {
                        id: id
                    }
                }
            })

            if (duplicateThuoc) {
                return NextResponse.json(
                    { error: 'Tên thuốc đã tồn tại' },
                    { status: 400 }
                )
            }
        }

        const updateData: Record<string, unknown> = {}

        if (data.tenThuoc) updateData.tenThuoc = data.tenThuoc
        if (data.moTa !== undefined) updateData.moTa = data.moTa || null
        if (data.gia) updateData.gia = parseFloat(data.gia)
        if (data.soLuong !== undefined) updateData.soLuong = parseInt(data.soLuong)
        if (data.danhMucId) updateData.danhMucId = parseInt(data.danhMucId)
        if (data.hangSanXuat) updateData.hangSanXuat = data.hangSanXuat
        if (data.xuatXu) updateData.xuatXu = data.xuatXu
        if (data.hinhAnh !== undefined) updateData.hinhAnh = data.hinhAnh || null
        if (data.trangThai) updateData.trangThai = data.trangThai
        if (data.hanSuDung !== undefined) updateData.hanSuDung = data.hanSuDung ? new Date(data.hanSuDung) : null
        if (data.cachDung !== undefined) updateData.cachDung = data.cachDung || null
        if (data.thanPhan !== undefined) updateData.thanPhan = data.thanPhan || null
        if (data.congDung !== undefined) updateData.congDung = data.congDung || null

        const thuoc = await prisma.thuoc.update({
            where: { id },
            data: updateData,
            include: {
                danhMuc: {
                    select: {
                        id: true,
                        tenDanhMuc: true,
                        icon: true,
                        mauSac: true
                    }
                }
            }
        })

        return NextResponse.json({ thuoc })
    } catch (error) {
        console.error('Error updating thuoc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật thuốc' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa thuốc
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // SỬA: Await params
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        // Check if thuoc exists
        const existingThuoc = await prisma.thuoc.findUnique({
            where: { id }
        })

        if (!existingThuoc) {
            return NextResponse.json(
                { error: 'Không tìm thấy thuốc' },
                { status: 404 }
            )
        }

        await prisma.thuoc.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Xóa thuốc thành công' })
    } catch (error) {
        console.error('Error deleting thuoc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi xóa thuốc' },
            { status: 500 }
        )
    }
}