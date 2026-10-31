# Changing a secret's type

A secret's type decides which fields it has. You can change it from the staff app, for one secret
or a selection. Sneakers-PAM shows you what happens to each field first, and nothing changes until
you confirm. The values stay sealed: the preview names fields, never their values.

## Before you start

- You have Author on the secret, or you own its folder.
- The secret isn't retired, and no rotation of it is running.

## From the edit page

The **Type** field on the edit page stays locked, so saving the form never changes a type.

1. Open the secret's edit page and select **Change type…** beside **Type**.

   The change works on the saved secret, so any unsaved edits on the form are dropped. Save first if
   you want to keep them.

2. Pick the **New type** and select **Continue**.

3. Read the preview, and answer anything it asks (see below). The preview runs again as you answer.

4. Select **Change type**. It's only available once the preview allows the change. The form reloads
   under the new type.

## From the browse page

1. To change one secret, open its row menu and select **Change type…**. To change several, select
   them and choose **Change type…** in the selection bar.

2. Pick the **New type** and select **Continue**.

3. For a selection, the secrets come up one at a time, each with its own preview. Select
   **Change type** to change that secret, **Skip** to leave it and go to the next, or **Stop here**
   to end the run.

4. A selection ends with a results table that lists each secret as changed or skipped. A secret
   already on the new type is reported as skipped.

## Reading the preview

**Where each field goes** lists every stored field and what happens to it:

| Result | What it means |
|---|---|
| **Carried over** | The value stays in a field with the same name. |
| **Moved** | The value goes to a different field of the new type. |
| **Moved to notes** | The new type has no field for it, so the value goes to its notes field. |
| **Blocked** | The value can't go there, and the change can't go ahead as it stands. |

For any field that isn't carried over, you can pick where it goes in the new type.

**The new type needs** lists required fields that nothing fills yet, each with a box to fill in. For
example, changing a Password to a Password Account (SSH) asks for **Host**.

The preview also says what happens to **Rotation**, **Heartbeat** and the **Target**. A new type
that doesn't take a target detaches the ones attached. Rotation stays off on a new rotation type
until you turn it on.

## Moving to notes

Nothing is lost in a type change. A value with no field in the new type moves to notes, and the
preview shows that as **Moved to notes** before you confirm.

If you don't want that, refuse it by leaving: select **Cancel** on one secret, or **Skip** in a
selection. The secret stays as it is. Or pick a field for the value.

Sensitive values never move to a less protected field. A sensitive value can only land in a
sensitive field, and a super-sensitive value only in a super-sensitive field, so neither can move
to notes. Such a change is blocked, naming the fields, until you give the value a field that
protects it as well.

If the preview showed nothing moving to notes and a value has been stored since, the change is
refused by name rather than moved unseen.

## Afterwards

The old values stay in the secret's history, and the new version says what changed: the old type,
the new type, and the fields added, renamed, carried over or moved to notes. The change is recorded
in the audit trail by field name, never by value.
